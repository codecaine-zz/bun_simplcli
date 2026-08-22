Output "assets/graph_demo.gif"

Set Shell "bash"
Set FontSize 14
Set Width 900
Set Height 420
Set Padding 20
Set Theme "TokyoNight"
Set WindowBar "Colorful"
Set BorderRadius 10

Type "bun run bin/simplcli.ts graph -d '15,35,60,95,120,90,55,30,15' -t 'Cluster CPU Load Distribution'"
Sleep 500ms
Enter
Sleep 4s
