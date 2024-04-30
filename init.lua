-- Fonction pour décoder une chaîne JSON en une table Lua
local function json_decode(str)
    return minetest.parse_json(str)
end

-- Fonction pour encoder une table Lua en une chaîne JSON
local function json_encode(tbl)
    return minetest.write_json(tbl)
end

local http = minetest.request_http_api()

-- Fonction pour lire et analyser le contenu du fichier JSON
local function read_position_from_json(filename)
    local file = io.open(minetest.get_worldpath() .. "/" .. filename, "r")
    if file then
        local content = file:read("*all")
        file:close()
        -- Analyser le contenu JSON
        local data = json_decode(content)
        if data then
            -- Stocker les valeurs dans des variables locales
            local x = data.position.x - cx
            local y = (data.position.y + y0) * echelle
            local z = data.position.z - cz
            -- Retourner les valeurs lues
            return x, y, z
        else
            minetest.log("error", "Erreur lors de l'analyse du JSON.")
        end
    else
        minetest.log("error", "Erreur lors de l'ouverture du fichier JSON.")
    end
    -- Si une erreur se produit, retourner des valeurs par défaut
    return 0, 0, 0
end

-- Fonction pour téléporter un joueur à une position spécifiée
local function teleport_player(player_name)
    -- Lire les données du fichier JSON
    local x, y, z = read_position_from_json("pos.json")

    -- Récupérer le joueur
    local player = minetest.get_player_by_name(player_name)
    if player then
        -- Téléporter le joueur à la nouvelle position
        player:set_pos({x = x, y = y, z = z})
    else
        minetest.log("error", "Joueur non trouvé pour la téléportation.")
    end
end

-- Ouvrir et lire le fichier JSON
local file = io.open(minetest.get_worldpath().."/geometry.dat", "r")
if file then
    local content = file:read("*all")
    file:close()

    -- Analyser le contenu JSON
    local data = json_decode(content)
    echelle = data.echelle
    zcno = data.coordinatesCarto[1][1]
    xcno = data.coordinatesCarto[1][2]
    zcse = data.coordinatesCarto[3][1]
    xcse = data.coordinatesCarto[3][2]
    y0 = data.altitudeZero
    cx = (xcno+xcse)/2
    cz = (zcno+zcse)/2
else
    minetest.after(1, minetest.chat_send_all, "Impossible d'ouvrir le fichier.")
end

local deplacement_minetest = true -- Utilisez la première lettre en minuscule pour true

-- Tableau pour stocker le dernier moment où la position a été mise à jour pour chaque joueur
local last_update_time = {}

local function update_player_position(player)
    local pos = player:get_pos()
    local position = {x=pos.x + cx, y = (pos.y - y0)/echelle , z = pos.z + cz}
    local yaw = math.deg(player:get_look_horizontal())
    local pitch = - math.deg(player:get_look_vertical())
    
    local data = {
        position = position,
        yaw = yaw,
        pitch = pitch,
        xmin = xcno,
        xmax = xcse,
        ymin = zcno,
        ymax = zcse
    }
    
    if http then
        local url = "http://127.0.0.1:3000/data"
        local timeout = 10  -- Temps d'attente maximal en secondes
    
        -- Convertir l'objet JSON en chaîne
        local body = minetest.write_json(data)
    
        http.fetch({
            url = url,
            timeout = timeout,
            method = "POST",
            headers = {
                ["Content-Type"] = "application/json",
            },
            data = body,  -- Envoyer les données JSON directement
        }, function(success, response)
        end)
        --minetest.chat_send_all(player:get_player_name() .. " se trouve à la position : " .. minetest.pos_to_string(position))
        --minetest.chat_send_all("yaw "..math.deg(player:get_look_horizontal()) .. " pitch " ..-math.deg(player:get_look_vertical()))
        last_update_time[player] = minetest.get_gametime()
    else
        print("L'API HTTP n'est pas disponible.")
    end
end

-- Définition de l'item
minetest.register_craftitem("modsitownsv0:mon_item", {
    description = "iTowns", -- Description de l'item
    inventory_image = "iTowns.png", -- Image de l'item (à remplacer par le nom de votre image)
    on_use = function(itemstack, user, pointed_thing)
        -- Inversion de l'état de deplacement_minetest
        deplacement_minetest = not deplacement_minetest
        
        -- Envoi d'un message dans le chat pour indiquer le changement d'état
        if deplacement_minetest then
            minetest.chat_send_all("Déplacement Minetest activé.")
        else
            minetest.chat_send_all("Déplacement Minetest désactivé.")
        end
    end,
})

-- Enregistrement de la fonction pour être appelée toutes les 10 secondes
minetest.register_globalstep(function(dtime)
    -- Vérifier toutes les 10 secondes
    if math.floor(minetest.get_gametime() % 1) == 0 and deplacement_minetest then
        -- Itérer sur tous les joueurs et mettre à jour leur position si suffisamment de temps s'est écoulé
        for _, player in ipairs(minetest.get_connected_players()) do
            if not last_update_time[player] or minetest.get_gametime() - last_update_time[player] >= 1 then
                update_player_position(player)
            end
        end

        -- Nettoyer la liste des derniers temps de mise à jour
        if math.floor(minetest.get_gametime() % 60) == 0 then
            for player, last_time in pairs(last_update_time) do
                if minetest.get_gametime() - last_time >= 60 then
                    last_update_time[player] = nil
                end
            end
        end
    end

    if math.floor(minetest.get_gametime() % 5) == 0 and not(deplacement_minetest) then
        for _, player in ipairs(minetest.get_connected_players()) do
            if not last_update_time[player] or minetest.get_gametime() - last_update_time[player] >= 1 then
                teleport_player(player:get_player_name())
            end
        end
    end
end)



