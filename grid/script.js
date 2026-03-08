

        let grid = []
        let size = 5
        let cursor = { x: 0, y: 0 }

        let targetPattern = []

        let colors = ["black", "blue", "green", "red"]
        let colorIndex = 0

        let step = 1

        const gridDiv = document.getElementById("grid")
        const logBody = document.querySelector("#logTable tbody")

        function createGrid() {

            size = parseInt(document.getElementById("gridSize").value)

            gridDiv.innerHTML = ""
            grid = []

            targetPattern = []

            gridDiv.style.gridTemplateColumns = `repeat(${size},40px)`

            for (let y = 0; y < size; y++) {

                let row = []

                targetPattern[y] = []

                for (let x = 0; x < size; x++) {

                    let cell = document.createElement("div")
                    cell.className = "cell"

                    cell.addEventListener("click", () => {

                        targetPattern[y][x] = targetPattern[y][x] ? 0 : 1

                        cell.style.background = targetPattern[y][x] ? "#94a3b8" : "white"

                    })

                    gridDiv.appendChild(cell)

                    row.push({
                        element: cell,
                        color: null
                    })

                    targetPattern[y][x] = 0

                }

                grid.push(row)

            }

            cursor = { x: 0, y: 0 }
            updateCursor()

        }

        function updateCursor() {

            document.querySelectorAll(".cell")
                .forEach(c => c.classList.remove("cursor"))

            grid[cursor.y][cursor.x].element.classList.add("cursor")

        }

        function log(action) {

            let tr = document.createElement("tr")

            tr.innerHTML = `
<td>${step++}</td>
<td>${action}</td>
<td>${cursor.x}</td>
<td>${cursor.y}</td>
`

            logBody.appendChild(tr)

        }

        function move(dx, dy, label) {

            cursor.x = Math.max(0, Math.min(size - 1, cursor.x + dx))
            cursor.y = Math.max(0, Math.min(size - 1, cursor.y + dy))

            updateCursor()

            log("Mover " + label)

        }

        function paint() {

            let cell = grid[cursor.y][cursor.x]

            cell.color = colors[colorIndex]

            cell.element.style.background = colors[colorIndex]

            log("Pintar")

        }

        function changeColor() {

            colorIndex = (colorIndex + 1) % colors.length

            log("Trocar Cor")

        }

        function clearGrid() {

            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {

                    grid[y][x].color = null
                    grid[y][x].element.style.background = "white"
                    targetPattern[y][x] = 0

                }
            }

            cursor = { x: 0, y: 0 }
            updateCursor()

            logBody.innerHTML = ""
            step = 1

        }

        function applyTemplate() {

            let t = document.getElementById("template").value

            clearGrid()

            if (t === "random") {
                randomTemplate()
                return
            }

            

            const templates5= {

                t1: [
                    [0, 0, 1, 0, 0],
                    [0, 1, 1, 1, 0],
                    [1, 1, 1, 1, 1],
                    [0, 1, 0, 1, 0],
                    [0, 1, 0, 1, 0]
                ],

                t2: [
                    [0, 1, 1, 1, 0],
                    [1, 1, 1, 1, 1],
                    [0, 1, 1, 1, 0],
                    [0, 0, 1, 0, 0],
                    [0, 0, 1, 0, 0]
                ],

                t3: [
                    [0, 1, 1, 1, 0],
                    [0, 1, 1, 1, 0],
                    [0, 1, 1, 1, 0],
                    [0, 0, 1, 0, 0],
                    [0, 1, 1, 1, 0]
                ],

                t4: [
                    [0, 1, 0, 0, 0],
                    [1, 1, 0, 1, 0],
                    [0, 1, 1, 1, 0],
                    [0, 1, 1, 1, 0],
                    [0, 1, 0, 1, 0]
                ],

                t5: [
                    [0, 1, 0, 1, 0],
                    [1, 1, 0, 1, 1],
                    [0, 0, 0, 0, 0],
                    [1, 0, 0, 0, 1],
                    [0, 1, 1, 1, 0]
                ],

                t6: [
                    [0, 0, 0, 0, 0],
                    [0, 1, 1, 1, 0],
                    [0, 1, 0, 1, 0],
                    [0, 1, 1, 1, 0],
                    [0, 0, 0, 0, 0]
                ]
            }
            const templates10 = {
                
                t7: [
                    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
                    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
                    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ],

                t8: [
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
                    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
                    [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
                    [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
                    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
                    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1]
                ],

                t9: [
                    [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
                    [1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ],

                t10: [
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
                    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
                    [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
                    [1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                ],

                t11: [
                    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
                    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
                    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ],

                t12: [
                    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ]



            }

            let templates = size === 5 ? templates5 : templates10

            targetPattern = templates[t]

            if(!targetPattern){
            alert("Esse gabarito não existe para grid "+size+"x"+size)
            createGrid()
            
            }

            for(let y=0;y<targetPattern.length;y++){
            for(let x=0;x<targetPattern[y].length;x++){

            if(targetPattern[y][x]==1){
            grid[y][x].element.style.background="#94a3b8"
            }

            }
            }

            }

        function randomTemplate() {

            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {

                    let v = Math.random() < 0.3 ? 1 : 0
                    targetPattern[y][x] = v

                    if (v) {
                        grid[y][x].element.style.background = "#94a3b8"
                    }

                }
            }

        }

        function heuristic(a, b) {

            return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

        }

        function astar(start, goal) {

            let open = [start]
            let came = {}
            let g = {}
            let f = {}

            let key = (p) => p.x + "_" + p.y

            g[key(start)] = 0
            f[key(start)] = heuristic(start, goal)

            while (open.length) {

                open.sort((a, b) => f[key(a)] - f[key(b)])
                let current = open.shift()

                if (current.x == goal.x && current.y == goal.y) {

                    let path = []

                    while (key(current) in came) {

                        path.push(current)
                        current = came[key(current)]

                    }

                    path.reverse()
                    return path

                }

                let neighbors = [
                    { x: current.x + 1, y: current.y },
                    { x: current.x - 1, y: current.y },
                    { x: current.x, y: current.y + 1 },
                    { x: current.x, y: current.y - 1 }
                ]

                for (let n of neighbors) {

                    if (n.x < 0 || n.y < 0 || n.x >= size || n.y >= size) continue

                    let tentative = g[key(current)] + 1

                    if (!(key(n) in g) || tentative < g[key(n)]) {

                        came[key(n)] = current
                        g[key(n)] = tentative
                        f[key(n)] = tentative + heuristic(n, goal)

                        if (!open.find(p => p.x == n.x && p.y == n.y)) {
                            open.push(n)
                        }

                    }

                }

            }

            return []

        }

        function solvePattern() {

            let remaining = []

            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {

                    if (targetPattern[y][x] == 1) {
                        remaining.push({ x, y })
                    }

                }
            }

            let pos = { x: 0, y: 0 }
            let path = []

            while (remaining.length) {

                let bestIndex = 0
                let bestDist = Infinity

                for (let i = 0; i < remaining.length; i++) {

                    let d = Math.abs(pos.x - remaining[i].x) + Math.abs(pos.y - remaining[i].y)

                    if (d < bestDist) {
                        bestDist = d
                        bestIndex = i
                    }

                }

                let target = remaining.splice(bestIndex, 1)[0]

                let p = astar(pos, target)

                for (let step of p) {

                    if (step.x > pos.x) path.push("RIGHT")
                    if (step.x < pos.x) path.push("LEFT")
                    if (step.y > pos.y) path.push("DOWN")
                    if (step.y < pos.y) path.push("UP")

                    pos = { x: step.x, y: step.y }

                }

                path.push("PAINT")

            }

            executePath(path)

        }

        function executePath(path) {

            let i = 0

            let interval = setInterval(() => {

                if (i >= path.length) {
                    clearInterval(interval)
                    return
                }

                let a = path[i]

                if (a == "RIGHT") move(1, 0, "Direita")
                if (a == "LEFT") move(-1, 0, "Esquerda")
                if (a == "UP") move(0, -1, "Cima")
                if (a == "DOWN") move(0, 1, "Baixo")
                if (a == "PAINT") paint()

                i++

            }, 120)

        }

        document.addEventListener("keydown", function (event) {

            switch (event.key) {

                case "ArrowUp":
                    move(0, -1, "Cima")
                    break

                case "ArrowDown":
                    move(0, 1, "Baixo")
                    break

                case "ArrowLeft":
                    move(-1, 0, "Esquerda")
                    break

                case "ArrowRight":
                    move(1, 0, "Direita")
                    break

                case " ":
                    event.preventDefault()
                    paint()
                    break

                case "c":
                case "C":
                    changeColor()
                    break

            }

        })

        createGrid()

