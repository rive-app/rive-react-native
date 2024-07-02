require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

fabric_enabled = ENV['RCT_NEW_ARCH_ENABLED'] == '1'

Pod::Spec.new do |s|
  s.name         = "rive-react-native"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "14.0" }
  s.source       = { :git => "https://github.com/rive-app/rive-react-native.git", :tag => "#{s.version}" }

  if fabric_enabled
    s.subspec "Fabric" do |ss|
      ss.source_files = "ios/Fabric/**/*.{h,mm}"
    end
  end

  s.source_files = "ios/**/*.{h,m,mm,swift}"

  if fabric_enabled
    s.dependency "rive-react-native/Fabric"
  end

  s.dependency "React-Core"
  s.dependency "RiveRuntime", "5.14.0"

  if fabric_enabled then
    s.compiler_flags = folly_compiler_flags + " -DRCT_NEW_ARCH_ENABLED=1"
    s.pod_target_xcconfig    = {
        "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\"",
        "OTHER_CPLUSPLUSFLAGS" => "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1",
        "CLANG_CXX_LANGUAGE_STANDARD" => "c++17"
    }
    s.dependency "React-RCTFabric"
    s.dependency "React-Codegen"
    s.dependency "RCT-Folly"
    s.dependency "RCTRequired"
    s.dependency "RCTTypeSafety"
    s.dependency "ReactCommon/turbomodule/core"
  end
end
