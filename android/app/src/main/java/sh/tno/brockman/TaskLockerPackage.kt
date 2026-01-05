package sh.tno.brockman

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class TaskLockerPackage : BaseReactPackage() {

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
          if (name == TaskLockerModule.NAME) TaskLockerModule(reactContext) else null

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
    mapOf(
            TaskLockerModule.NAME to
                    ReactModuleInfo(
                            name = TaskLockerModule.NAME,
                            className = TaskLockerModule.NAME,
                            canOverrideExistingModule = false,
                            needsEagerInit = false,
                            isCxxModule = false,
                            isTurboModule = true
                    )
    )
  }
}
