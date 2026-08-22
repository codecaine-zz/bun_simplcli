Output "assets/kalker_demo.gif"

Set Shell "bash"
Set FontSize 14
Set Width 950
Set Height 500
Set Padding 20
Set Theme "TokyoNight"
Set WindowBar "Colorful"
Set BorderRadius 10

Type "bun run bin/simplcli.ts kalker 'sin(pi / 4) * sqrt(144)'"
Sleep 500ms
Enter
Sleep 3s

Type "bun run bin/simplcli.ts kalker --diff 'x^3 + 2*x^2 - 5*x, x=3'"
Sleep 500ms
Enter
Sleep 3s

Type "bun run bin/simplcli.ts kalker --integral 'x^2 * sin(x), 0, 3.14159'"
Sleep 500ms
Enter
Sleep 4s
