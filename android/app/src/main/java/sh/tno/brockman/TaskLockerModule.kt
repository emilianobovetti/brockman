package sh.tno.brockman

import android.app.Activity
import android.app.ActivityManager
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class TaskLockerModule(reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext) {
  override fun getName() = "TaskLockerModule"

  @ReactMethod
  fun getLockTaskModeState(): String {
    val activity = getActivity()
    val activityManager = activity.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager

    return when (activityManager.getLockTaskModeState()) {
      ActivityManager.LOCK_TASK_MODE_NONE -> "LOCK_TASK_MODE_NONE"
      ActivityManager.LOCK_TASK_MODE_LOCKED -> "LOCK_TASK_MODE_LOCKED"
      ActivityManager.LOCK_TASK_MODE_PINNED -> "LOCK_TASK_MODE_PINNED"
      else -> "LOCK_TASK_MODE_UNKNOWN"
    }
  }

  @ReactMethod
  fun isDeviceOwnerApp(): Boolean {
    return getDevicePolicyManager(getActivity()).isDeviceOwnerApp("sh.tno.brockman")
  }

  @ReactMethod
  fun startLockTask() {
    val activity = getActivity()
    val devicePolicyManager = getDevicePolicyManager(activity)
    val component = ComponentName(activity, AdminReceiver::class.java)
    devicePolicyManager.setLockTaskPackages(
            component,
            arrayOf(
                    "sh.tno.brockman",
                    "com.android.chrome",
                    "org.mozilla.firefox",
                    "org.mozilla.fennec_fdroid",
                    "com.google.android.youtube"
            )
    )

    activity.startLockTask()
  }

  @ReactMethod
  fun stopLockTask() {
    getActivity().stopLockTask()
  }

  private fun getActivity(): Activity {
    return currentActivity ?: throw IllegalStateException("Current activity is null")
  }

  private fun getDevicePolicyManager(activity: Activity): DevicePolicyManager {
    return activity.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
  }
}
