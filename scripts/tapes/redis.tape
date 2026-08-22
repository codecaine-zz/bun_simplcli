Output "assets/redis_demo.gif"

Set Shell "bash"
Set FontSize 14
Set Width 900
Set Height 520
Set Padding 20
Set Theme "TokyoNight"
Set WindowBar "Colorful"
Set BorderRadius 10

Type "bun run bin/simplcli.ts redis -n auth_service --set user:admin --val 'Alex (Admin)'"
Sleep 500ms
Enter
Sleep 1.5s

Type "bun run bin/simplcli.ts redis -n auth_service --set session:tok_991 --val 'active'"
Sleep 500ms
Enter
Sleep 1.5s

Type "bun run bin/simplcli.ts redis -n analytics --set active_visitors --val '1420'"
Sleep 500ms
Enter
Sleep 1.5s

Type "bun run bin/simplcli.ts redis -n auth_service --get user:admin"
Sleep 500ms
Enter
Sleep 1.5s

Type "bun run bin/simplcli.ts redis -n auth_service --keys"
Sleep 500ms
Enter
Sleep 1.5s

Type "bun run bin/simplcli.ts redis -n analytics --keys"
Sleep 500ms
Enter
Sleep 2.5s
