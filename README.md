# Android

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
  `$ANDROID_HOME/platform-tools/adb reverse tcp:8081 tcp:8081`
- Run android build:
  `yarn android`
- Start metro server:
  `yarn start`
