Output "assets/crypto_demo.gif"

Set Shell "bash"
Set FontSize 14
Set Width 900
Set Height 420
Set Padding 20
Set Theme "TokyoNight"
Set WindowBar "Colorful"
Set BorderRadius 10

Type "bun run bin/simplcli.ts crypto --algo sha256 --text 'Bun SimpleCLI High-Performance Toolkit'"
Sleep 500ms
Enter
Sleep 2s

Type "bun run bin/simplcli.ts crypto --key 'MySecretVaultKey2026' --encrypt 'Zero-Dependency Bun CLI Framework'"
Sleep 500ms
Enter
Sleep 3s
