-- Fonction pour décoder une chaîne JSON en une table Lua
local function json_decode(str)
    return minetest.parse_json(str)
end

-- Fonction pour encoder une table Lua en une chaîne JSON
local function json_encode(tbl)
    return minetest.write_json(tbl)
end

local http = minetest.request_http_api()

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

-- Ouvrir et lire le fichier JSON
local file = io.open(minetest.get_worldpath().."/geometry.dat", "r")
if file then
    local content = file:read("*all")
    file:close()

    -- Analyser le contenu JSON
    local data = json_decode(content)
    echelle = data.echelle
    xcno = data.coordinatesCarto[1][1]
    zcno = data.coordinatesCarto[1][2]
    xcse = data.coordinatesCarto[3][1]
    zcse = data.coordinatesCarto[3][2]
    y0 = data.altitudeZero
    cx = (xcno+xcse)/2
    cz = (zcno+zcse)/2
else
    minetest.after(1, minetest.chat_send_all, "Impossible d'ouvrir le fichier.")
end

deplacement_minetest = true

-- Tableau pour stocker le dernier moment où la position a été mise à jour pour chaque joueur
local last_update_time = {}

local function update_player_position(player)
    local pos = player:get_pos()
    local position = {x=(pos.x + cx)*echelle, y = (pos.y - y0)/echelle , z = (pos.z + cz)*echelle}
    local yaw = math.deg(player:get_look_horizontal())
    local pitch = - math.deg(player:get_look_vertical())
    
    local data = {
        position = position,
        yaw = yaw,
        pitch = pitch,
        xmin = xcno,
        xmax = xcse,
        ymax = zcno,
        ymin = zcse,
        deplacement_minetest = deplacement_minetest
    }
    
    if http then
        local url = "http://127.0.0.1:3000/postDeplacementM"
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
        if deplacement_minetest == true then
            last_update_time[player] = minetest.get_gametime()
        end
    else
        print("L'API HTTP n'est pas disponible.")
    end
end

-- Fonction pour téléporter un joueur à une position spécifiée
local function teleport_player(player)
    if http then
        local url = "http://127.0.0.1:3000/getDeplacementI"
        local timeout = 10
        http.fetch({
            url = url,
            timeout = timeout,
            method = "GET",
            headers = {
                ["Content-Type"] = "application/json",
            },
        }, function(success)
            if success then
                local pos_itowns = minetest.parse_json(success.data) 
                local x = pos_itowns.x
                local y = pos_itowns.z
                local z = pos_itowns.y
                local yawi = pos_itowns.yaw
                local pitchi=pos_itowns.pitch
                if yawi == nil then 
                    yawi=0
                end
                if pitchi == nil then 
                    pitchi=0
                end
                x = (x - cx) * echelle
                y = (y + y0) * echelle
                z = (z - cz) * echelle
                if deplacement_minetest == false then
                    last_update_time[player] = minetest.get_gametime()
                    player:set_pos({x = x, y = y, z = z})
                    player:set_look_horizontal(yawi)
                    player:set_look_vertical(pitchi)
                end
            else
                minestest.chat_send_all("La requête HTTP a échoué")
            end
        end)
    end
end

-- Enregistrement de la fonction pour être appelée toutes les 10 secondes
minetest.register_globalstep(function(dtime)
    -- Vérifier toutes les 10 secondes
    if math.floor(minetest.get_gametime() % 1) == 0 then
        -- Itérer sur tous les joueurs et mettre à jour leur position si suffisamment de temps s'est écoulé
        for _, player in ipairs(minetest.get_connected_players()) do
            if not last_update_time[player] or minetest.get_gametime() - last_update_time[player] >= 1 then
                teleport_player(player)
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
end)



