Brockman is a RSS/Atom news aggregator built with react native

![photo_2020-07-24_11-23-10](https://user-images.githubusercontent.com/3957026/88380299-9b2d7680-cda4-11ea-8dd1-273ff55afd04.jpg)

Icons are stolen from [polymerelements/iron-icons](https://github.com/PolymerElements/iron-icons/blob/d3acebe047c6b5372b5b93703cdfd8f776f3660d/iron-icons.js)

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
$ echo "sdk.dir=$HOME/Android/Sdk" > android/local.properties
$ yarn start
```

## Install

```
$ echo "sdk.dir=$HOME/Android/Sdk" > android/local.properties
$ yarn android-release
$ cd android
$ ./gradlew assembleRelease
$ adb install app/build/outputs/apk/release/app-release.apk
$ adb shell dpm set-device-owner --user current sh.tno.brockman/.AdminReceiver
```
