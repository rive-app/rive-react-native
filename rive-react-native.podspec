require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

# Resolve Rive iOS SDK version
podfile_properties_path = File.join(__dir__, "ios", "Podfile.properties.json")
if File.exist?(podfile_properties_path)
  podfile_properties = JSON.parse(File.read(podfile_properties_path))
  rive_ios_version = podfile_properties["RiveRuntimeIOSVersion"]
end

rive_ios_version ||= package["runtimeVersions"]["ios"]

if rive_ios_version.nil?
  raise "Could not determine Rive iOS SDK version. Please add 'runtimeVersions.ios' to package.json"
end

Pod::UI.puts "rive-react-native: Using Rive iOS SDK #{rive_ios_version}"

Pod::Spec.new do |s|
  s.name         = "rive-react-native"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "14.0" }
  s.source       = { :git => "https://github.com/rive-app/rive-react-native.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"

  s.swift_version = "5.0"

  s.dependency "React-Core"
  s.dependency "RiveRuntime", rive_ios_version
end
