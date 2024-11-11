Brockman is a RSS/Atom news aggregator built with react native

![photo_2020-07-24_11-23-10](https://user-images.githubusercontent.com/3957026/88380299-9b2d7680-cda4-11ea-8dd1-273ff55afd04.jpg)

## Local setup on Arch Linux

```
# pacman -S libbsd jdk17-openjdk
```

Then install the following packages from AUR:

[android-studio](https://aur.archlinux.org/packages/android-studio)
[android-sdk-platform-tools](https://aur.archlinux.org/packages/android-sdk-platform-tools)
[android-sdk-cmdline-tools-latest](https://aur.archlinux.org/packages/android-sdk-cmdline-tools-latest)
[android-emulator](https://aur.archlinux.org/packages/android-emulator)

```
$ sdkmanager --licenses
$ yarn
$ yarn android-avd # start the emulator
$ ANDROID_HOME="$HOME/Android/Sdk" ANDROID_SDK_ROOT= yarn start
```
