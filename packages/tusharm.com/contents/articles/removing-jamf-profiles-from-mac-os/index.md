```metadata
title: Removing jamf profiles from Mac OS
date: 2021-Jan-07
template: article.pug
hide: true
category: article
```

I have found [jamf] to be too interfering and personally very frustrating while installing softwares and changing some system-level settings on my mac. I prefer keeping it disabled whenever possible. Here are the steps I follow that have always worked for me

1. Begin with restarting your computer.
2. Keep `cmd + R` pressed to startup in [recovery mode].
3. Open the **Terminal** and type the following command to disable [System Integrity Protection] and then reboot.
   ```zsh
   $ csrutil disable
   Successfully disabled System Integrity Protection. Please restart the machine for the changes to take effect.
   $ reboot
   ```
4. Verify integrity protection is **disabled**.
   ```zsh
   $ csrutil status
   disabled
   ```
5. First uninstall [jamf]
   ```zsh
   $ sudo jamf -removeFramework
   Removing scheduled tasks ...
   Removing self service ...
   Removing JAMF Preference file ...
   Removing JAMF Daemon Log files ...
   ```
6. Next delete all existing profiles.
   ```zsh
   $ sudo rm -rf  /var/db/ConfigurationProfiles
   Password:
   ```
7. Re-enable the integrity protection from rebooting again into [recovery mode].
   ```zsh
   $ csrutil enable
   Successfully enabled System Integrity Protection. Please restart the machine for the changes to take effect.
   $ reboot
   ```

[jamf]: https://www.jamf.com
[system integrity protection]: https://support.apple.com/en-us/HT204899
[recovery mode]: https://support.apple.com/en-in/HT201255#:~:text=Command%20(%E2%8C%98)%2DR%3A%20Start,macOS%20Recovery%20over%20the%20Internet.
