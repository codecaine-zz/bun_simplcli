Output "assets/stats_demo.gif"

Set Shell "bash"
Set FontSize 14
Set Width 900
Set Height 420
Set Padding 20
Set Theme "TokyoNight"
Set WindowBar "Colorful"
Set BorderRadius 10

Type "bun run bin/simplcli.ts statistics '12.5, 24.0, 38.5, 42.0, 56.5, 68.0, 75.5, 89.0, 95.0, 112.5'"
Sleep 500ms
Enter
Sleep 4s
