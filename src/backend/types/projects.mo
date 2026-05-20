module {
  public type Project = {
    id : Text;
    name : Text;
    state : Text;
    projectType : Text;
    contractor : Text;
    value : Float;
    status : Text;
    completion : Nat;
    delayDays : Int;
    costOverrun : Float;
    riskScore : Nat;
  };

  public type Tender = {
    id : Text;
    title : Text;
    ministry : Text;
    estimatedValue : Float;
    l1Bid : Float;
    l2Bid : Float;
    fraudRisk : Text;
    clauses : [Text];
    status : Text;
  };

  public type Vendor = {
    id : Text;
    name : Text;
    credibilityScore : Nat;
    litigationCount : Int;
    blacklisted : Bool;
    financialHealth : Text;
    activeProjects : Nat;
    completedProjects : Nat;
    avgDelayDays : Int;
  };

  public type Asset = {
    id : Text;
    name : Text;
    assetType : Text;
    location : Text;
    healthScore : Nat;
    degradationRate : Float;
    lastInspection : Text;
    maintenancePriority : Text;
    sensorStatus : Text;
  };

  public type Alert = {
    id : Text;
    severity : Text;
    alertModule : Text;
    description : Text;
    project : Text;
    timestamp : Text;
  };

  public type DashboardStats = {
    totalProjects : Nat;
    delayedProjects : Nat;
    totalPipelineValue : Float;
    costOverruns : Float;
    arbitrationExposure : Float;
    onTrackPercent : Nat;
  };
};
