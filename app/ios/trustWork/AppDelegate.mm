#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <FirebaseCore.h>
#import <Firebase.h>
#import <GoogleMaps/GoogleMaps.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"AIzaSyCunQgYGv_Q1yv8eaFSYvF5GE1ra9OTXbs"]; // add this line

  [FIRApp configure];
  [application registerForRemoteNotifications];

  self.moduleName = @"trustWork";

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)application:(UIApplication *)application
 didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
 [FIRMessaging messaging].APNSToken = deviceToken;
}

// - (BOOL)application:(UIApplication *)application
//     openURL:(NSURL *)url
//     options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
//   return [RCTLinkingManager application:application openURL:url options:options];
// }


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

@end
