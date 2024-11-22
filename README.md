Brockman is a RSS/Atom news aggregator built with react native

![Screenshot_2024-11-22_23-09-55](https://github.com/user-attachments/assets/4a36da3a-0c0e-467b-b461-d800d21e6ac7)

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

Generate the keystore first:

```
$ echo 'BROCKMAN_UPLOAD_STORE_FILE=brockman-release.keystore
BROCKMAN_UPLOAD_KEY_ALIAS=brockman-release
BROCKMAN_UPLOAD_STORE_PASSWORD=secret
BROCKMAN_UPLOAD_KEY_PASSWORD=secret' > "$HOME/.gradle/gradle.properties"

cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore brockman-release.keystore -alias brockman-release -keyalg RSA -keysize 2048 -validity 10000
```

Build and install, optionally use `dpm set-device-owner` to enable task locking:

```
$ echo "sdk.dir=$HOME/Android/Sdk" > android/local.properties
$ yarn android-release
$ cd android
$ ./gradlew assembleRelease
$ adb install app/build/outputs/apk/release/app-release.apk
$ adb shell dpm set-device-owner --user current sh.tno.brockman/.AdminReceiver
```
