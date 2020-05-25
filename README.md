Brockman is a RSS/Atom news aggregator built with react native

![photo_2020-07-24_11-23-10](https://user-images.githubusercontent.com/3957026/88380299-9b2d7680-cda4-11ea-8dd1-273ff55afd04.jpg)

## Android

- Download and install [Android Studio](https://developer.android.com/studio/index.html)
- Set `ANDROID_HOME` environment variable:
  `export ANDROID_HOME="/path/to/Android/Sdk"`

  You may want to use jre included in Android Studio:
  `export JAVA_HOME="/path/to/Android-studio/jre"`
- Run `sdkmanager`:
  `$ANDROID_HOME/tools/bin/sdkmanager --licenses`
- Start `adb` server:
  `$ANDROID_HOME/platform-tools/adb start-server`

  Set `Debug USB` mode on your smartphone and run
  `$ANDROID_HOME/platform-tools/adb reverse tcp:8097 tcp:8097`
- Run android build:
  `yarn android`
- Start metro server:
  `yarn start`
