import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DashboardStats {
    arbitrationExposure: number;
    costOverruns: number;
    totalProjects: bigint;
    totalPipelineValue: number;
    delayedProjects: bigint;
    onTrackPercent: bigint;
}
export interface Alert {
    id: string;
    description: string;
    alertModule: string;
    timestamp: string;
    severity: string;
    project: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Tender {
    id: string;
    status: string;
    title: string;
    ministry: string;
    l1Bid: number;
    l2Bid: number;
    clauses: Array<string>;
    estimatedValue: number;
    fraudRisk: string;
}
export interface Asset {
    id: string;
    degradationRate: number;
    maintenancePriority: string;
    name: string;
    sensorStatus: string;
    lastInspection: string;
    assetType: string;
    healthScore: bigint;
    location: string;
}
export interface Vendor {
    id: string;
    name: string;
    activeProjects: bigint;
    credibilityScore: bigint;
    avgDelayDays: bigint;
    completedProjects: bigint;
    financialHealth: string;
    blacklisted: boolean;
    litigationCount: bigint;
}
export interface Project {
    id: string;
    completion: bigint;
    status: string;
    delayDays: bigint;
    projectType: string;
    value: number;
    name: string;
    costOverrun: number;
    state: string;
    riskScore: bigint;
    contractor: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface backendInterface {
    generateAIInsight(prompt: string): Promise<string>;
    getAlerts(): Promise<Array<Alert>>;
    getAssets(): Promise<Array<Asset>>;
    getDashboardStats(): Promise<DashboardStats>;
    getProjects(): Promise<Array<Project>>;
    getTenders(): Promise<Array<Tender>>;
    getVendors(): Promise<Array<Vendor>>;
    setGeminiApiKey(key: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
