import Debug "mo:core/Debug";
import Types "../types/projects";

mixin () {
  public func getProjects() : async [Types.Project] {
    Debug.todo()
  };

  public func getTenders() : async [Types.Tender] {
    Debug.todo()
  };

  public func getVendors() : async [Types.Vendor] {
    Debug.todo()
  };

  public func getAssets() : async [Types.Asset] {
    Debug.todo()
  };

  public func getAlerts() : async [Types.Alert] {
    Debug.todo()
  };

  public func getDashboardStats() : async Types.DashboardStats {
    Debug.todo()
  };
};
