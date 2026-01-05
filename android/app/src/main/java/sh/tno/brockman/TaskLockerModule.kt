package sh.tno.brockman

import android.app.Activity
import android.app.ActivityManager
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import sh.tno.brockman.ffi.NativeTaskLockerSpec

class TaskLockerModule(reactContext: ReactApplicationContext) : NativeTaskLockerSpec(reactContext) {

  override fun getName() = NAME

  companion object {
    const val NAME = "TaskLockerModule"
  }

  override fun getLockTaskModeState(): String {
    val activity = getActivity()
    val activityManager = activity.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager

    return when (activityManager.getLockTaskModeState()) {
      ActivityManager.LOCK_TASK_MODE_NONE -> "LOCK_TASK_MODE_NONE"
      ActivityManager.LOCK_TASK_MODE_LOCKED -> "LOCK_TASK_MODE_LOCKED"
      ActivityManager.LOCK_TASK_MODE_PINNED -> "LOCK_TASK_MODE_PINNED"
      else -> "LOCK_TASK_MODE_UNKNOWN"
    }
  }

  override fun isDeviceOwnerApp(): Boolean {
    val policyManager = getDevicePolicyManager(getActivity())

    return policyManager.isDeviceOwnerApp("sh.tno.brockman")
  }

  override fun startLockTask() {
    val activity = getActivity()
    val policyManager = getDevicePolicyManager(activity)
    val component = ComponentName(activity, AdminReceiver::class.java)
    policyManager.setLockTaskPackages(
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

  override fun stopLockTask() {
    getActivity().stopLockTask()
  }

  private fun getActivity(): Activity {
    return reactApplicationContext.currentActivity
            ?: throw IllegalStateException("Current activity is null")
  }

  private fun getDevicePolicyManager(activity: Activity): DevicePolicyManager {
    return activity.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
  }
}
