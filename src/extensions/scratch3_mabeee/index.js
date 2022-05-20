const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const log = require("../../util/log");
const cast = require("../../util/cast");
const formatMessage = require("format-message");
const BLE = require("../../io/ble");
const Base64Util = require("../../util/base64-util");

const blockIconUri = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCI+CiAgPGRlZnM+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtcGF0aCI+CiAgICAgIDxyZWN0IGlkPSLplbfmlrnlvaJfMiIgZGF0YS1uYW1lPSLplbfmlrnlvaIgMiIgd2lkdGg9IjEzLjIxOCIgaGVpZ2h0PSI0My4xMDQiIGZpbGw9Im5vbmUiLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXAtXzQweDQwIj4KICAgICAgPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIi8+CiAgICA8L2NsaXBQYXRoPgogIDwvZGVmcz4KICA8ZyBpZD0iXzQweDQwIiBkYXRhLW5hbWU9IjQweDQwIiBjbGlwLXBhdGg9InVybCgjY2xpcC1fNDB4NDApIj4KICAgIDxnIGlkPSLjgrDjg6vjg7zjg5dfMjYiIGRhdGEtbmFtZT0i44Kw44Or44O844OXIDI2Ij4KICAgICAgPHJlY3QgaWQ9IumVt+aWueW9ol8xIiBkYXRhLW5hbWU9IumVt+aWueW9oiAxIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9Im5vbmUiLz4KICAgICAgPGcgaWQ9IuOCsOODq+ODvOODl18yNCIgZGF0YS1uYW1lPSLjgrDjg6vjg7zjg5cgMjQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDg3IDkuNDM0KSByb3RhdGUoLTQ1KSI+CiAgICAgICAgPGcgaWQ9IuOCsOODq+ODvOODl18yIiBkYXRhLW5hbWU9IuOCsOODq+ODvOODlyAyIiBjbGlwLXBhdGg9InVybCgjY2xpcC1wYXRoKSI+CiAgICAgICAgICA8cGF0aCBpZD0i44OR44K5XzE1IiBkYXRhLW5hbWU9IuODkeOCuSAxNSIgZD0iTTEzLjIsMy4xNDFsLS4wMDUtLjA5Yy0uMDc5LS42OTQtLjcxNy0xLjkzNy00LjEtMi40NjRMOC45MzcuNTYzQTQuNDc2LDQuNDc2LDAsMCwwLDYuNiwwLDQuNDc5LDQuNDc5LDAsMCwwLDQuMjc0LjU2MUw0LjExNy41ODZDLjcyMywxLjExMS4wODQsMi4zNTYuMDA1LDMuMDUxTDAsMy4xLjAxMSw0MC4zNjRsLjAwNS4wOWMuMDY1LjU3NS40ODksMS4zODUsMi4xNDIsMS45ODJsLjAzOS4wMTRjLjA2My4wMjIuMTI2LjA0NC4xOS4wNjVsLjA1OC4wMTguMTgyLjA1Ni4wNjguMDIuMTg0LjA1MS4wNjkuMDE4LjE5LjA0Ny4wNy4wMTcuMjExLjA0Ny4wNTYuMDEyLjI3Mi4wNTRjLjEuMDE4LjE5Mi4wMzQuMy4wNTJsLjI3My4wNDEuMDgyLjAxMS4yMS4wMjcuMS4wMTIuMTkzLjAyMS4xMTYuMDExLjE4OS4wMTcuMTIyLjAwOS4xOTEuMDEzLjEyMi4wMDcuMi4wMS4xMi4wMDUuMjE1LjAwNi4xMDcsMGMuMTA3LDAsLjIxNSwwLC4zMjQsMHMuMjE4LDAsLjMyNiwwbC4xMDYsMCwuMjE1LS4wMDYuMTIyLS4wMDUuMi0uMDA5LjEyLS4wMDguMTkyLS4wMTMuMTIxLS4wMS4xODktLjAxNi4xMTUtLjAxMUw4LjUwNiw0M2wuMTA2LS4wMTIuMTk0LS4wMjUuMS0uMDEzLjItLjAzLjA3OS0uMDEyLjIxNy0uMDM3LjA2Mi0uMDExLjI0My0uMDQ3LjAyNy0uMDA1YzIuMjQ1LS40NjQsMy40ODItMS4zNTksMy40ODItMi41MjEsMC0uMDQtLjAxNi0zNy4xNDMtLjAxNi0zNy4xNDNNOS42MjIsNDIuMjUybC0uMDIyLDAtLjIzNy4wNDYtLjA2LjAxMS0uMjA3LjAzNS0uMDc3LjAxMi0uMi4wMjktLjA5Mi4wMTMtLjE4OC4wMjQtLjEuMDEyLS4xODUuMDItLjExLjAxMS0uMTgzLjAxNi0uMTE2LjAwOS0uMTg1LjAxMi0uMTE3LjAwNy0uMTkxLjAwOS0uMTE4LjAwNS0uMjA4LjAwNi0uMSwwcS0uMTU3LDAtLjMxNSwwdC0uMzE0LDBsLS4xLDAtLjIwOS0uMDA2LS4xMTYsMC0uMTktLjAwOS0uMTE4LS4wMDctLjE4NS0uMDEzLS4xMTgtLjAwOS0uMTgyLS4wMTYtLjExMi0uMDExLS4xODYtLjAyLS4xLS4wMTEtLjItLjAyNkw0LjQsNDIuMzlsLS4yNjItLjAzOWMtLjEtLjAxNy0uMi0uMDMzLS4yODktLjA1bC0uMjYtLjA1MS0uMDU0LS4wMTItLjItLjA0NC0uMDY2LS4wMTYtLjE4LS4wNDUtLjA2Ni0uMDE4LS4xNzItLjA0OC0uMDY0LS4wMThMMi42MTYsNDJsLS4wNTQtLjAxNy0uMTc3LS4wNi0uMDM3LS4wMTNjLTEuMDkyLS4zOTQtMS43LS45MTgtMS43NzItMS41MTV2LS4wMjdMLjU2NCwzLjEyOGwwLS4wMTRjLjEtLjksMS40NjItMS42MzQsMy42MzgtMS45NzFMNC41MDksMS4xQTMuMzcxLDMuMzcxLDAsMCwxLDYuNi41NjQsMy4zNjQsMy4zNjQsMCwwLDEsOC43LDEuMWwuMzA2LjA0N2MyLjE3MS4zMzgsMy41MjksMS4wNzQsMy42MywxLjk3bDAsLjAyN3MuMDE2LDM3LjEuMDE2LDM3LjE0M2MwLC44NTMtMS4xMDUsMS41Ny0zLjAzMiwxLjk2OCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAwKSIgZmlsbD0iI2ZmZiIvPgogICAgICAgICAgPHBhdGggaWQ9IuODkeOCuV8xNiIgZGF0YS1uYW1lPSLjg5HjgrkgMTYiIGQ9Ik0wLDBIMFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDguMjg1IDMuMzcyKSIgZmlsbD0iI2ZmZiIvPgogICAgICAgICAgPHBhdGggaWQ9IuODkeOCuV8xNyIgZGF0YS1uYW1lPSLjg5HjgrkgMTciIGQ9Ik0wLDBIMFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDguNzIxIDMuMTIyKSIgZmlsbD0iI2ZmZiIvPgogICAgICAgICAgPHBhdGggaWQ9IuODkeOCuV8xOCIgZGF0YS1uYW1lPSLjg5HjgrkgMTgiIGQ9Ik0xMi4wNzIsMi41NWMtLjEtLjktMS40NTktMS42MzItMy42My0xLjk3TDguMTM2LjUzM0EzLjM2NSwzLjM2NSwwLDAsMCw2LjA0LDAsMy4zNzEsMy4zNzEsMCwwLDAsMy45NDUuNTMyTDMuNjM5LjU3OUMxLjQ2My45MTYuMSwxLjY1MywwLDIuNTVsMCwuMDE0TC4wMTEsMzkuOGwwLC4wMjdjLjA2OC42LjY4LDEuMTIxLDEuNzcyLDEuNTE1bC4wMzcuMDEzLjE3Ny4wNi4wNTQuMDE3LjE3LjA1Mi4wNjQuMDE4LjE3Mi4wNDguMDY2LjAxOC4xOC4wNDUuMDY2LjAxNi4yLjA0NC4wNTQuMDEyLjI2LjA1MWMuMDkxLjAxNy4xODQuMDMzLjI4OS4wNWwuMjYyLjAzOS4wNzkuMDEuMi4wMjYuMS4wMTEuMTg2LjAyLjExMi4wMTEuMTgyLjAxNi4xMTguMDA5TDUsNDEuOTQzbC4xMTguMDA3LjE5LjAwOS4xMTYuMDA1LjIwOS4wMDYuMSwwcS4xNTYsMCwuMzE0LDB0LjMxNSwwbC4xLDAsLjIwOC0uMDA2LjExOC0uMDA1LjE5MS0uMDA5LjExNy0uMDA3LjE4NS0uMDEyLjExNi0uMDA5LjE4My0uMDE2LjExLS4wMTEuMTg1LS4wMi4xLS4wMTIuMTg4LS4wMjQuMDkyLS4wMTMuMi0uMDI5LjA3Ny0uMDEyLjIwNy0uMDM1LjA2LS4wMTEuMjM3LS4wNDYuMDIyLDBjMS45MjctLjQsMy4wMzItMS4xMTYsMy4wMzItMS45NjgsMC0uMDQtLjAxNi0zNy4xNDMtLjAxNi0zNy4xNDNaTTQuMDYuNzY0QTIuOTM0LDIuOTM0LDAsMCwxLDYuMDQzLjI0MiwyLjkyOSwyLjkyOSwwLDAsMSw4LjAyNy43NjUuMzA5LjMwOSwwLDAsMSw4LjEuOTU3czAsMS4wNzksMCwxLjA4OGMwLC40LS45MjMuNzE2LTIuMDYxLjcxNlMzLjk4NiwyLjQ0LDMuOTg2LDIuMDQ1bDAtMS4wODhBLjMxLjMxLDAsMCwxLDQuMDYuNzY0TTEwLjM5LDQxLjA1NWgwbC0uMDQyLjAxNWMtLjA3Ni4wMjktLjE1NC4wNTctLjIzNC4wODVsLS4wOTIuMDNxLS4xMDcuMDM1LS4yMTguMDY4bC0uMS4wM3EtLjExNy4wMzMtLjIzOC4wNjNsLS4xLjAyNWMtLjExNC4wMjgtLjIzLjA1NC0uMzUuMDc5bC0uMDM0LjAwNy0uMjIuMDQzLS4wNTkuMDExLS4yLjAzNC0uMDc2LjAxMi0uMTkyLjAyOS0uMDkuMDEyLS4xODUuMDI0LS4xLjAxMi0uMTgxLjAxOS0uMTEuMDExLS4xNzguMDE1LS4xMTYuMDA5LS4xOC4wMTItLjExOC4wMDctLjE4Ni4wMDktLjExNy4wMDUtLjIwNS4wMDYtLjEsMC0uMywwSDYuMDQxbC0uMywwLS4xLDAtLjItLjAwNi0uMTE3LS4wMDUtLjE4NC0uMDA5TDUuMDEzLDQxLjdsLS4xNzctLjAxMi0uMTE4LS4wMDktLjE3Ny0uMDE2LS4xMTItLjAxMS0uMTgxLS4wMi0uMS0uMDEyTDMuOTUyLDQxLjZsLS4wODEtLjAxMS0uMjUyLS4wMzgtLjAxNiwwcS0uMTM4LS4wMjItLjI3Mi0uMDQ3bC0uMDExLDAtLjI0My0uMDQ4LS4wNTYtLjAxMi0uMTkyLS4wNDMtLjA2NS0uMDE2LS4xNzUtLjA0NC0uMDY2LS4wMTctLjE2Ni0uMDQ2LS4wNjMtLjAxOEwyLjEzLDQxLjJsLS4wNTQtLjAxNy0uMTctLjA1OC0uMDM3LS4wMTNxLS4xLS4wMzYtLjE5NS0uMDc0aDBDLjgzNSw0MC43MDYuMzA5LDQwLjI3NC4yNTUsMzkuOEguMjM5VjIuNTc3SC4yNDVDLjMzNCwxLjc5MSwxLjcxOSwxLjEyMSwzLjY3OS44MThhLjU2Ny41NjcsMCwwLDAtLjAyLjE0bDAsMS4wODlhLjU4MS41ODEsMCwwLDAsLjA2MS4yNTkuNzExLjcxMSwwLDAsMCwuMTEuMTU4Yy4wMS4wMTEuMDE4LjAyMi4wMjguMDMycy4wMzkuMDM2LjA2LjA1NC4wMjYuMDIzLjA0MS4wMzQuMDQ0LjAzMy4wNjcuMDQ4bC4wNS4wMzMuMDc0LjA0My4wNTkuMDMxYy4wMjYuMDEzLjA1My4wMjYuMDguMDM5bC4wNjcuMDI4LjA4NS4wMzQuMDc5LjAyN2MuMDQxLjAxNC4wODMuMDI3LjEyNi4wMzlzLjA4My4wMjQuMTI1LjAzNGwuMDgzLjAxOS4xLjAyM0w1LjA0OCwzbC4xMDYuMDE4LjA4Ny4wMTMuMTEzLjAxNS4wODUuMDEuMTIxLjAxMS4wODEuMDA2LjEzNi4wMDcuMDY3LDBxLjEsMCwuMiwwdC4yLDBsLjA2NywwLC4xMzYtLjAwNy4wOC0uMDA2LjEyMS0uMDExLjA4Ni0uMDEuMTEyLS4wMTUuMDg4LS4wMTNMNy4wNDQsM2wuMDg4LS4wMTYuMS0uMDIyLjA4Ni0uMDE5LjEwOC0uMDNxLjA3NS0uMDIyLjE0Ny0uMDQ2bC4wNzQtLjAyNS4wNzUtLjAzaDBsLjAxMywwTDcuOCwyLjc3N2MuMDI4LS4wMTMuMDU2LS4wMjYuMDgzLS4wMzlsLjA1Ny0uMDI5LjA3Ni0uMDQ0LjA0OC0uMDMyYy4wMjQtLjAxNi4wNDctLjAzMi4wNjktLjA0OWwuMDI3LS4wMjNoMEw4LjE3LDIuNTVjLjAyMS0uMDE4LjA0My0uMDM3LjA2Mi0uMDU2cy4wMTYtLjAxOS4wMjUtLjAyOEEuNzE0LjcxNCwwLDAsMCw4LjM2OSwyLjNhLjU4My41ODMsMCwwLDAsLjA2Mi0uMjZjMC0uMDA5LDAtMS4wODksMC0xLjA4OUEuNTU4LjU1OCwwLDAsMCw4LjQwNy44MTljMS45NTcuMywzLjMzOC45NzMsMy40MjgsMS43NTloLjAwNlYzOS42YS43MjcuNzI3LDAsMCwxLC4wMTEuMTE4YzAsLjUxMy0uNTUzLjk4LTEuNDYyLDEuMzM2IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjU2NCAwLjU2NCkiIGZpbGw9IiMwMGE3ZWEiLz4KICAgICAgICAgIDxwYXRoIGlkPSLjg5HjgrlfMTkiIGRhdGEtbmFtZT0i44OR44K5IDE5IiBkPSJNMS40NTEsMy4xNzlsMC0uMDA2YS4zMjEuMzIxLDAsMCwxLC4yLS4xOTVWMi40MjloLjgzNVYxLjQ4N2gxYS41ODIuNTgyLDAsMCwxLS4wNjEtLjI1OWwwLTEuMDg5QS41NjcuNTY3LDAsMCwxLDMuNDQxLDBDMS40OC4zLjEuOTc0LjAwNiwxLjc1OUgwVjM4Ljk4MkguMDE3Yy4wNTQuNDc0LjU3OS45MDYsMS40MTgsMS4yNFYzLjE3OVoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuODAzIDEuMzgyKSIgZmlsbD0iIzAwYTdlYSIvPgogICAgICAgICAgPHBhdGggaWQ9IuODkeOCuV8yMCIgZGF0YS1uYW1lPSLjg5HjgrkgMjAiIGQ9Ik0zLjQ3MiwxLjc1OUgzLjQ2NkMzLjM3Ny45NzQsMiwuMy4wMzksMEEuNTY3LjU2NywwLDAsMSwuMDU4LjEzN3MwLDEuMDgsMCwxLjA4OUEuNTgzLjU4MywwLDAsMSwwLDEuNDg2SDF2Ljk0MmguODIzdi41NDloMGEuMzIxLjMyMSwwLDAsMSwuMi4xOTVsMCwuMDA2YS4zMjIuMzIyLDAsMCwxLDAsLjJWNDAuMjM3Yy45MDktLjM1NSwxLjQ2Mi0uODIzLDEuNDYyLTEuMzM2YS43MDYuNzA2LDAsMCwwLS4wMTEtLjExOFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDguOTMzIDEuMzgzKSIgZmlsbD0iIzAwYTdlYSIvPgogICAgICAgICAgPHBhdGggaWQ9IuODkeOCuV8yMSIgZGF0YS1uYW1lPSLjg5HjgrkgMjEiIGQ9Ik0uODM1LDBWLjk0Mkgwdi41NDlBLjMyLjMyLDAsMCwxLC4wNDYsMS40OEguMDU1YS4yODkuMjg5LDAsMCwxLC4wNDEsMEguMTJsLjAzLDBhLjMyNy4zMjcsMCwwLDEsLjA1Ny4wMTMsMTIuNzcyLDEyLjc3MiwwLDAsMCwzLjk0MS41NTVBMTIuNzc0LDEyLjc3NCwwLDAsMCw4LjA4OSwxLjQ5YS4zMTQuMzE0LDAsMCwxLC4wNTctLjAxM2wuMDMsMEg4LjJhLjMwNy4zMDcsMCwwLDEsLjA0LDBsLjAxLDBhLjMzOC4zMzgsMCwwLDEsLjA0Ni4wMTJoMFYuOTQySDcuNDczVjBoLTFhLjcyLjcyLDAsMCwxLS4xMTMuMTYxQzYuMzU2LjE3MSw2LjM0OC4xOCw2LjM0LjE4OVM2LjMuMjI3LDYuMjc4LjI0NUw2LjI2Ny4yNTUsNi4yMzkuMjc4QzYuMjE3LjMsNi4xOTQuMzExLDYuMTcuMzI3TDYuMTIyLjM1OSw2LjA0Ni40LDUuOTg5LjQzM2MtLjAyNy4wMTQtLjA1NC4wMjctLjA4My4wMzlMNS44NDIuNSw1LjgzLjVsLS4wNzUuMDNMNS42ODEuNTU5UTUuNjEuNTgzLDUuNTM0LjZsLS4xMDguMDNMNS4zNC42NTRsLS4xLjAyMkw1LjE1Mi42OTJsLS4xLjAxOEw0Ljk1OS43MjMsNC44NDguNzM4bC0uMDg2LjAxTDQuNjQxLjc1OGwtLjA4LjAwNkw0LjQyNS43NzFsLS4wNjcsMHEtLjEsMC0uMiwwdC0uMiwwbC0uMDY3LDBMMy43NS43NjQsMy42NjkuNzU4LDMuNTQ4Ljc0NywzLjQ2My43MzgsMy4zNS43MjMsMy4yNjMuNzEsMy4xNTcuNjkyLDMuMDcuNjc2bC0uMS0uMDIzTDIuODg0LjYzNEMyLjg0Mi42MjQsMi44LjYxMiwyLjc1OS42UzIuNjc0LjU3NCwyLjYzMy41NjFMMi41NTUuNTM0LDIuNDY5LjUsMi40LjQ3MiwyLjMyMi40MzMsMi4yNjMuNEMyLjIzNy4zODksMi4yMTMuMzc0LDIuMTg5LjM2TDIuMTM4LjMyN0MyLjExNS4zMTEsMi4wOTMuMywyLjA3MS4yNzlTMi4wNDQuMjU2LDIuMDMxLjI0NCwxLjk4OS4yMDksMS45NzEuMTksMS45NTIuMTY5LDEuOTQzLjE1OEEuNzE2LjcxNiwwLDAsMSwxLjgzMywwaC0xWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMi40NTYgMi44NjkpIiBmaWxsPSIjZmZmIi8+CiAgICAgICAgICA8cGF0aCBpZD0i44OR44K5XzIyIiBkYXRhLW5hbWU9IuODkeOCuSAyMiIgZD0iTTEuMzk0LDEuMDlBMS4xLDEuMSwwLDAsMCwuNTczLjAyMkMuMjkzLS4wNSwwLC4wNTEsMCwuMzU4VjIuMDEzbDEuMzk0LjNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjM3OCAxNC40MjEpIiBmaWxsPSIjZmZmIi8+CiAgICAgICAgICA8cGF0aCBpZD0i44OR44K5XzIzIiBkYXRhLW5hbWU9IuODkeOCuSAyMyIgZD0iTTAsMS42MzhBLjg2My44NjMsMCwwLDAsLjQ4OSwyLjVoMGMuNDI0LjIzMSwxLjExOC4zMSwxLjExOC0uNTQzVi4zMzlMMCwwWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNi44MSAyMC44OTIpIiBmaWxsPSIjZmZmIi8+CiAgICAgICAgICA8cGF0aCBpZD0i44OR44K5XzI0IiBkYXRhLW5hbWU9IuODkeOCuSAyNCIgZD0iTTAsMS44cy41MDguMS42NTEuMTI5Yy4yMDguMDQ1LjI4My0uMDYzLjI4Mi0uMjM2Vi4yTDAsMFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYuMDA4IDM3LjY2MikiIGZpbGw9IiNmZmYiLz4KICAgICAgICAgIDxwYXRoIGlkPSLjg5HjgrlfMjUiIGRhdGEtbmFtZT0i44OR44K5IDI1IiBkPSJNMCwxLjhzLjUwOC4xLjY1MS4xM2gwYy4yMDcuMDQ2LjI4Mi0uMDYxLjI4Mi0uMjM2Vi4yTDAsMFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYuMDA4IDI2LjYwNikiIGZpbGw9IiNmZmYiLz4KICAgICAgICAgIDxwYXRoIGlkPSLjg5HjgrlfMjYiIGRhdGEtbmFtZT0i44OR44K5IDI2IiBkPSJNMCwxLjhzLjUwOC4xLjY1MS4xM2gwYy4yMDcuMDQ1LjI4Mi0uMDYyLjI4Mi0uMjM3Vi4yTDAsMFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYuMDA4IDMyLjE3MSkiIGZpbGw9IiNmZmYiLz4KICAgICAgICAgIDxwYXRoIGlkPSLjg5HjgrlfMjciIGRhdGEtbmFtZT0i44OR44K5IDI3IiBkPSJNMCwxLjY2N2EuOTUyLjk1MiwwLDAsMCwuODIxLjk1NGgwYy4zNTIuMDkzLjc4Mi4wMTEuNzgyLS41NTlWLjM0NEwwLDBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjU2OCAyMC40MDUpIiBmaWxsPSIjZmZmIi8+CiAgICAgICAgICA8cGF0aCBpZD0i44OR44K5XzI4IiBkYXRhLW5hbWU9IuODkeOCuSAyOCIgZD0iTTguNjg4LjI2NmwwLC4wMDhhLjMyLjMyLDAsMCwxLS4wMzUuMDQ3TDguNjM3LjMzMmEuMzEuMzEsMCwwLDEtLjA0Mi4wMzRMOC41OC4zNzdhLjMyMi4zMjIsMCwwLDEtLjA2NS4wMzFBMTMuNDI0LDEzLjQyNCwwLDAsMSw0LjM2NywxLDEzLjQyNCwxMy40MjQsMCwwLDEsLjIxOS40MDkuMzIyLjMyMiwwLDAsMSwuMDE3LDBIMFYzNy4wNDRIMHEuMDk1LjAzOC4xOTUuMDc0bC4wMzcuMDEzLjE3LjA1OC4wNTQuMDE3LjE2NC4wNS4wNjMuMDE4LjE2Ni4wNDYuMDY3LjAxOC4xNzUuMDQzLjA2NS4wMTYuMTkyLjA0My4wNTYuMDEyLjI0NC4wNDguMDExLDBxLjEzNC4wMjUuMjcyLjA0N2wuMDE2LDAsLjI1Mi4wMzguMDgxLjAxMS4xOTUuMDI1LjEuMDExLjE4MS4wMi4xMTIuMDExLjE3Ny4wMTUuMTE4LjAwOS4xNzcuMDEyLjEyMS4wMDcuMTg0LjAwOS4xMTcuMDA1LjIuMDA2LjEsMCwuMywwaC4wMjRsLjMsMCwuMSwwLC4yMDUtLjAwNi4xMTctLjAwNS4xODYtLjAwOS4xMTgtLjAwNy4xOC0uMDEyLjExNi0uMDA5LjE3OC0uMDE1TDYsMzcuNjU3bC4xODEtLjAxOS4xLS4wMTIuMTg1LS4wMjQuMDktLjAxMi4xOTItLjAyOS4wNzYtLjAxMi4yLS4wMzQuMDU5LS4wMS4yMi0uMDQzLjAzNC0uMDA3Yy4xMi0uMDI1LjIzNi0uMDUxLjM1LS4wNzlsLjEtLjAyNXEuMTIxLS4wMzEuMjM4LS4wNjNsLjEtLjAzYy4wNzQtLjAyMi4xNDctLjA0NC4yMTgtLjA2OGwuMDkyLS4wM2MuMDgxLS4wMjguMTU4LS4wNTYuMjM0LS4wODVsLjA0Mi0uMDE1aDBWLjJhLjMyMi4zMjIsMCwwLDEtLjAyOS4wNjNtLTcsOS44OTNjLjA0My0xLjIyOS42NzUtMS40MywxLjM3My0xLjIyNWExLjc5LDEuNzksMCwwLDEsMS4xMjQsMS44NTRjMCwuMDI2LDAsLjA0OSwwLC4wNzRoMHYxLjQ0NmExLjc0NywxLjc0NywwLDAsMSwuNjA3LjI4OVY5LjU0OGwuNjQ5LjEzOXY0LjE4OGwtMy43NTItLjhzMC0yLjgxNCwwLTIuOTEzbTIuOSwyNi4yMS0xLjMyMS0uMjgzVjMyLjk5NWwtMS4xMTctLjI0djMuMDlhLjc3NC43NzQsMCwwLDEtLjQ2Mi0uNzY5di0zLjc0czEuMi4yNjQsMi40Mi41MjNhMS42NTIsMS42NTIsMCwwLDEsMS4zNTgsMS41MzZsMCwyLjI2N2MwLC43NTEtLjUzMS43ODMtLjg4MS43MDhtMC01LjQ5MWMtLjM1LS4wNzctMS4zMi0uMjgzLTEuMzItLjI4M1YyNy41bC0xLjExNy0uMjR2My4wOWEuNzczLjc3MywwLDAsMS0uNDYyLS43Njl2LTMuNzRzMS4yLjI2NCwyLjQyLjUyM0ExLjY1MiwxLjY1MiwwLDAsMSw1LjQ2NSwyNy45bDAsMi4yNjdjMCwuNzUxLS41MzIuNzg1LS44ODIuNzA4bTAtNS41NjVMMy4yNjUsMjUuMDNWMjEuOTM4TDIuMTQ4LDIxLjd2My4wODhhLjc3My43NzMsMCwwLDEtLjQ2Mi0uNzY3VjIwLjI3OHMxLjIuMjY2LDIuNDIuNTIzYTEuNjUzLDEuNjUzLDAsMCwxLDEuMzU4LDEuNTM2bDAsMi4yNjdjMCwuNzUxLS41MzEuNzg0LS44ODEuNzA5bTIuMjI4LTYuMjU5QTEuMSwxLjEsMCwwLDEsNS40NjUsMjAuMTFjLS43Mi0uMDk0LTEuMDcyLS44NDYtMS4xNzYtMS4zNmExLjA2NywxLjA2NywwLDAsMS0xLjQ4Mi43NzgsMS43NDQsMS43NDQsMCwwLDEtMS4xMi0xLjcxMWgwVjE0LjM4OXMyLjU2My41NSwzLjc4MS44MDlhMS42MzYsMS42MzYsMCwwLDEsMS4zNDgsMS41MlpNMi4yNzIsNC44NjQsNS45NTksNy4yMDdoLS4wMUExLjcsMS43LDAsMCwxLDYuODIyLDguNjRMMS42ODQsNy41NFY2LjIyN2MuMDkxLjAyLDEuNTQ0LjMzMywyLjc1Ny41OTFMMS42ODQsNS4wNjJWMy43MTJjLjYtLjEsMi4wNjMtLjM2NywzLjA0Ny0uNjIxTDEuNjg0LDIuNDM4VjEuOTgzTDYuMSwyLjkyNWExLjc1MSwxLjc1MSwwLDAsMSwuOTYyLjhaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyLjIzNyA0LjU2MSkiIGZpbGw9IiNmZmYiLz4KICAgICAgICAgIDxwYXRoIGlkPSLjg5HjgrlfMjkiIGRhdGEtbmFtZT0i44OR44K5IDI5IiBkPSJNMy43ODEuODA5QzIuNTYzLjU1LDAsMCwwLDBWMy40MjhIMGExLjc0NCwxLjc0NCwwLDAsMCwxLjEyLDEuNzExQTEuMDY3LDEuMDY3LDAsMCwwLDIuNiw0LjM2MWMuMS41MTUuNDU2LDEuMjY2LDEuMTc2LDEuMzZBMS4xLDEuMSwwLDAsMCw1LjEyOSw0LjY2NVYyLjMyOUExLjYzNiwxLjYzNiwwLDAsMCwzLjc4MS44MDlNMi4yNDksMy41MTljMCwuNTY5LS40MzEuNjUxLS43ODIuNTU4aDBhLjk1Mi45NTIsMCwwLDEtLjgyMS0uOTU0VjEuNDU2bDEuNi4zNDRaTTQuNSwzLjg5NGMwLC44NTMtLjY5NC43NzQtMS4xMTguNTQzaDBhLjg2NC44NjQsMCwwLDEtLjQ4NS0uODU3VjEuOTQybDEuNi4zMzhaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzLjkyMSAxOC45NDkpIiBmaWxsPSIjZDFjZmM3Ii8+CiAgICAgICAgICA8cGF0aCBpZD0i44OR44K5XzMwIiBkYXRhLW5hbWU9IuODkeOCuSAzMCIgZD0iTTMuNzUzLDUuMDExVi44MjNMMy4xMDUuNjg0VjMuNzMzQTEuNzQ5LDEuNzQ5LDAsMCwwLDIuNSwzLjQ0NFYyaDBjMC0uMDI1LDAtLjA0OCwwLS4wNzRBMS43ODksMS43ODksMCwwLDAsMS4zNzQuMDdDLjY3Ni0uMTM1LjA0NC4wNjYsMCwxLjI5NGMwLC4xLDAsMi45MTMsMCwyLjkxM1pNLjQ1OCwxLjM1NGMwLS4zMDguMjkzLS40MDguNTczLS4zMzZhMS4xLDEuMSwwLDAsMSwuODIxLDEuMDY3VjMuMzA5bC0xLjM5NC0uM1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMuOTIgMTMuNDI1KSIgZmlsbD0iI2QxY2ZjNyIvPgogICAgICAgICAgPHBhdGggaWQ9IuODkeOCuV8zMSIgZGF0YS1uYW1lPSLjg5HjgrkgMzEiIGQ9Ik00LjQxNi45NDIsMCwwVi40NTVsMy4wNDcuNjUyQzIuMDYzLDEuMzYxLjYsMS42MjUsMCwxLjcyOXYxLjM1TDIuNzU3LDQuODM1QzEuNTQ0LDQuNTc2LjA5MSw0LjI2NCwwLDQuMjQ0VjUuNTU3bDUuMTM4LDEuMWExLjcwNSwxLjcwNSwwLDAsMC0uODczLTEuNDMzaC4wMUwuNTg4LDIuODgxbDQuNzktMS4xNDNhMS43NTEsMS43NTEsMCwwLDAtLjk2Mi0uOCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy45MjEgNi41NDQpIiBmaWxsPSIjZDFjZmM3Ii8+CiAgICAgICAgICA8cGF0aCBpZD0i44OR44K5XzMyIiBkYXRhLW5hbWU9IuODkeOCuSAzMiIgZD0iTTIuNDIyLjUyM0MxLjIuMjY2LDAsMCwwLDBWMy43NDFhLjc3My43NzMsMCwwLDAsLjQ2MS43NjdWMS40MmwxLjExNy4yNFY0Ljc1MUwyLjksNS4wMzVjLjM1LjA3NS44ODEuMDQzLjg4MS0uNzA5bDAtMi4yNjdBMS42NTMsMS42NTMsMCwwLDAsMi40MjIuNTIzbS42LDIuOTM3YzAsLjE3NS0uMDc1LjI4Mi0uMjgyLjIzNmgwYy0uMTQzLS4wMzItLjY1MS0uMTMtLjY1MS0uMTN2LTEuOGwuOTMzLjJaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzLjkyMSAyNC44MzkpIiBmaWxsPSIjZDFjZmM3Ii8+CiAgICAgICAgICA8cGF0aCBpZD0i44OR44K5XzMzIiBkYXRhLW5hbWU9IuODkeOCuSAzMyIgZD0iTTIuNDIyLjUyM0MxLjIuMjY0LDAsMCwwLDBWMy43NGEuNzczLjc3MywwLDAsMCwuNDYxLjc2OVYxLjQxOWwxLjExNy4yNFY0Ljc1cy45Ny4yMDcsMS4zMi4yODMuODgyLjA0NC44ODItLjcwOGwwLTIuMjY3QTEuNjUyLDEuNjUyLDAsMCwwLDIuNDIyLjUyM20uNiwyLjkzN2MwLC4xNzUtLjA3NS4yODItLjI4Mi4yMzdoMGMtLjE0My0uMDMyLS42NTEtLjEzLS42NTEtLjEzdi0xLjhsLjkzMy4yWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy45MjEgMzAuNDA1KSIgZmlsbD0iI2QxY2ZjNyIvPgogICAgICAgICAgPHBhdGggaWQ9IuODkeOCuV8zNCIgZGF0YS1uYW1lPSLjg5HjgrkgMzQiIGQ9Ik0yLjQyMi41MjNDMS4yLjI2NCwwLDAsMCwwVjMuNzRhLjc3My43NzMsMCwwLDAsLjQ2MS43NjlWMS40MmwxLjExNy4yNFY0Ljc1MUwyLjksNS4wMzRjLjM1LjA3NS44ODEuMDQzLjg4MS0uNzA4bDAtMi4yNjdBMS42NTMsMS42NTMsMCwwLDAsMi40MjIuNTIzbS42LDIuOTM3YzAsLjE3NC0uMDc0LjI4MS0uMjgyLjIzNi0uMTQzLS4wMzItLjY1MS0uMTI5LS42NTEtLjEyOXYtMS44bC45MzMuMloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMuOTIxIDM1Ljg5NikiIGZpbGw9IiNkMWNmYzciLz4KICAgICAgICAgIDxwYXRoIGlkPSLjg5HjgrlfMzUiIGRhdGEtbmFtZT0i44OR44K5IDM1IiBkPSJNMi4wNjUsMi41MTljMS4xMzgsMCwyLjA2MS0uMzIsMi4wNjEtLjcxNiwwLS4wMDksMC0xLjA4OCwwLTEuMDg4QS4zMDkuMzA5LDAsMCwwLDQuMDQ1LjUyMywyLjkzLDIuOTMsMCwwLDAsMi4wNjEsMCwyLjkzMywyLjkzMywwLDAsMCwuMDc4LjUyMi4zMDkuMzA5LDAsMCwwLDAsLjcxNkwwLDEuOGMwLC40LjkyMy43MTYsMi4wNjEuNzE2TS40NDUsMS4wNzV2MGEuMTEuMTEsMCwwLDEsLjEzOC0uMDY3LDQuMzM4LDQuMzM4LDAsMCwwLDEuMzM5LjE4OSw0LjM0LDQuMzQsMCwwLDAsMS4zMzktLjE4OS4xMDkuMTA5LDAsMCwxLC4xMzguMDY3djBhLjExLjExLDAsMCwxLS4wNjkuMTM5LDQuNTYyLDQuNTYyLDAsMCwxLTEuNDA5LjIsNC41NjEsNC41NjEsMCwwLDEtMS40MDktLjIuMTEuMTEsMCwwLDEtLjA2OS0uMTM5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LjU0NiAwLjgwNikiIGZpbGw9IiNmZmYiLz4KICAgICAgICAgIDxwYXRoIGlkPSLjg5HjgrlfMzYiIGRhdGEtbmFtZT0i44OR44K5IDM2IiBkPSJNLjA3NC4yMTNhNC41NjIsNC41NjIsMCwwLDAsMS40MDkuMiw0LjU2MSw0LjU2MSwwLDAsMCwxLjQwOS0uMkEuMTEuMTEsMCwwLDAsMi45NjIuMDc0djBBLjEwOS4xMDksMCwwLDAsMi44MjMuMDA2LDQuMzQsNC4zNCwwLDAsMSwxLjQ4NC4xOTQsNC4zMzksNC4zMzksMCwwLDEsLjE0NS4wMDYuMTA5LjEwOSwwLDAsMCwuMDA3LjA3M3YwQS4xMS4xMSwwLDAsMCwuMDc0LjIxMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNC45ODUgMS44MDYpIiBmaWxsPSIjMDBhN2VhIi8+CiAgICAgICAgICA8cGF0aCBpZD0i44OR44K5XzM3IiBkYXRhLW5hbWU9IuODkeOCuSAzNyIgZD0iTTguNDYsMGEuMzA3LjMwNywwLDAsMC0uMDQsMEg4LjRsLS4wMywwYS4zMTQuMzE0LDAsMCwwLS4wNTcuMDEzQTEyLjc3NCwxMi43NzQsMCwwLDEsNC4zNjcuNTcxLDEyLjc3MSwxMi43NzEsMCwwLDEsLjQyNi4wMTYuMzI2LjMyNiwwLDAsMCwuMzY5LDBMLjMzOSwwSC4zMTVBLjMxMi4zMTIsMCwwLDAsLjI3NCwwSC4yNjVBLjMyMy4zMjMsMCwwLDAsLjAyLjIxMmwwLC4wMDZhLjMyMi4zMjIsMCwwLDAsLjIuNDA5LDEzLjQyNSwxMy40MjUsMCwwLDAsNC4xNDguNTg5QTEzLjQyNCwxMy40MjQsMCwwLDAsOC41MTUuNjI3LjMyMi4zMjIsMCwwLDAsOC41OC42TDguNTk1LjU4NUEuMzIyLjMyMiwwLDAsMCw4LjYzNy41NUw4LjY0OC41MzlBLjMyOS4zMjksMCwwLDAsOC42ODMuNDkybDAtLjAwOEEuMzIzLjMyMywwLDAsMCw4LjcxNy4yMThsMC0uMDA2YS4zMjIuMzIyLDAsMCwwLS4yLS4xOTVBLjMzOC4zMzgsMCwwLDAsOC40NjkuMDA2TDguNDYsMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMi4yMzcgNC4zNDMpIiBmaWxsPSIjMDBhN2VhIi8+CiAgICAgICAgPC9nPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K";

const OutputPort = 0x01;

const MaBeeeUUID = {
    service: "b9f5ff00-d813-46c6-8b61-b453ee2c74d9",
    pwmDutyCharactristic: "b9f53006-d813-46c6-8b61-b453ee2c74d9",
};

class MaBeee {
    constructor(runtime, extensionId) {
        this._runtime = runtime;

        this._ble = null;
        this._runtime.registerPeripheralExtension(extensionId, this);
        this._extensionId = extensionId;
        this._timeoutID = null;
        this._busy = false;
        this._busyTimeoutID = null;
        //this.reset = this.reset.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this._onMessage = this._onMessage.bind(this);
    }

    scan() {
        console.log("scan");
        if (this._ble) {
            this._ble.disconnect();
        }
        this._ble = new BLE(
            this._runtime,
            this._extensionId,
            {
                filters: [{ services: [MaBeeeUUID.service] }],
            },
            this._onConnect,
            this.reset
        );
    }

    connect(id) {
        console.log("connect");
        if (this._ble) {
            this._ble.connectPeripheral(id);
        }
    }

    disconnect() {
        console.log("disconnect");
        if (this._ble) {
            this._ble.disconnect();
        }
    }

    isConnected() {
        console.log("isConnected");
        if (this._ble) {
            return this._ble.isConnected();
        }

        return false;
    }

    _onConnect() {
        console.log("_onConnect");
    }

    _onMessage() {
        console.log("_onMessage");
    }

    reset() {
        console.log("reset");
    }

    send(value) {
        console.log("send");
        if (!this.isConnected()) {
            return;
        }

        if (this._buzy) {
            return;
        }

        this._busy = true;

        byteArray = new Uint8Array(5);

        var text = value.toString(16).toUpperCase().padStart(2, "0");

        const hex = Uint8Array.from(Buffer.from(text, "hex"));
        byteArray[0] = OutputPort;
        byteArray[1] = hex[0];
        byteArray[2] = hex[1];
        byteArray[3] = hex[2];
        byteArray[4] = hex[3];

        writeData = Base64Util.uint8ArrayToBase64(byteArray);
        this._ble
            .write(
                MaBeeeUUID.service,
                MaBeeeUUID.pwmDutyCharactristic,
                writeData,
                "base64",
                true
            )
            .then(() => {
                this._busy = false;
            });
    }

    setPwm(value) {
        console.log("setPwm");
        console.log(value);
        this.send(value);
    }

    hexStringToByte(str) {
        var array = [];
        for (var i = 0; (i = str.length / 2); i++) {
            array.push(parseInt(str.substr(i, 2), 16));
        }
        return new Uint8Array(array);
    }
}

class MaBeeeBlock {
    constructor(runtime) {
        this.runtime = runtime;
        this.peripheral = new MaBeee(this.runtime, "maBeee");
    }

    getInfo() {
        return {
            id: "maBeee",
            name: "MaBeee",
            blockIconURI : blockIconUri,
            showStatusButton: true,
            blocks: [
                {
                    opcode: "setPower",
                    blockType: BlockType.COMMAND,
                    text: "Power [VALUE] %",
                    arguments: {
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "50",
                        },
                    },
                },
            ],
            menus: {},
        };
    }

    setPower(args) {
        console.log("setPower");
        console.log(args.VALUE);
        var power = parseInt(args.VALUE);

        if (power < 0) {
            power = 0;
        }

        if (power > 100) {
            power = 100;
        }

        this.peripheral.setPwm(power);
    }
}

module.exports = MaBeeeBlock;
