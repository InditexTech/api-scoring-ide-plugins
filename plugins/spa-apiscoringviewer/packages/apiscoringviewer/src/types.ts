import type { JSX } from "react";

export type ProtocolType = "REST" | "EVENT" | "GRPC";
export type Rating = "A+" | "A" | "B" | "C" | "D";
export type ValidationType =
  | "DESIGN"
  | "DOCUMENTATION"
  | "SECURITY"
  | "OVERALL_SCORE";

export enum Severity {
  Error = 0,
  Warning,
  Info,
}

export type VSCodeCommand<C extends string, P> = { command: C; payload: P };

export type SetCertificationResults = {
  command: "setCertificationResults";
  payload: CertificationPayload;
};

export type SetModuleResults = {
  command: "setModuleResults";
  payload: ModulePayload;
};

export type SetFileResults = {
  command: "setFileResults";
  payload: FilePayload;
};

export type SetFileResultsError = VSCodeCommand<"setFileResultsError", Error>;

export interface MessageHandler<P> {
  (payload: P): void;
}

export type CertificationPayload = {
  metadata: {
    apis: { name: string; apiSpecType: ProtocolType; definitionPath: string }[];
  };
  results: Certification[];
  rootPath?: string;
};

export type ModulePayload = {
  apiModule: ModuleValidation;
  results: Certification[];
};

export type ValidationResponse = Certification;

export type ApiIdentifier = {
  apiName: string;
  apiProtocol: ProtocolType;
};

export type Certification = ApiIdentifier & {
  rating?: Rating;
  ratingDescription: string;
  score: number;
  result: (
    | { designValidation: CodeValidation }
    | { securityValidation: CodeValidation }
    | { documentationValidation: DocValidation }
  )[];
};

export type ValidationTypes = CodeValidation & DocValidation;

type BaseValidation = {
  rating: Rating;
  ratingDescription: string;
  validationType: ValidationType;
  score: number;
};

export type CodeValidation = BaseValidation & {
  spectralValidation?: { issues: CodeIssue[] };
  protolintValidation?: { issues: ProtoIssue[] };
};

export type DocValidation = BaseValidation & {
  issues: DocIssue[];
};

export type CodeIssue = {
  /**
   * Name of the file that is being validated
   */
  fileName?: string;
  /**
   * Rule validation name
   */
  code?: string;
  /**
   * Rule description
   */
  message?: string;
  /**
   * Error level
   */
  severity?: Severity;
  /**
   * the source file where the issue was found
   */
  source?: string;
  range?: Range;
  /**
   * Path of the error
   */
  path?: Array<string>;
};

export type ProtoIssue = {
  line: number;
  column: number;
  message: string;
  rule: string;
  fileName: string;
  severity: Severity;
};

export type DocIssue = {
  lineNumber?: number;
  ruleNames?: string[];
  ruleDescription?: string;
  ruleInformation?: string;
  errorDetail?: string | null;
  errorContext?: string | null;
  errorRange?: [number, number];
  fileName?: string;
  severity?: Severity;
};

export type Range = {
  start?: Position;
  end?: Position;
};

export type Position = {
  /**
   * Line number
   */
  line?: number;
  /**
   * Character number
   */
  character?: number;
};

export type DataProviderChildFn = (props: {
  certification?: CertificationPayload | null;
  loading: boolean;
  error?: Error | null;
  modulesMetadata: ModulesMetadata;
  apisRevalidationMetadata: ModulesMetadata;
  revalidateModule?: (validationBody: ModuleValidation) => void;
  revalidateApi?: (validationBody: ModuleValidation) => void;
}) => JSX.Element;

export type ModuleValidation = {
  apiName: string;
  apiDefinitionPath?: string;
  validationType: ValidationType;
  apiSpecType: ProtocolType;
};

export type ModuleMetadata = { loading: boolean };
export type ModulesMetadata = Record<string, ModuleMetadata>;

export type RevalidateModule = (validationBody: ModuleValidation) => void;

export type VSCodeMessage = {
  apiName?: string;
  module?: string;
  fileName?: string;
  filePath?: string;
  content?: string;
  infoPosition?: {
    line?: number;
    char?: number;
    lastLine?: number;
    lastchar?: number;
  };
};

export type PickRenameMulti<
  T,
  R extends {
    [K in keyof R]: K extends keyof T ? PropertyKey : "Error: key not in T";
  }
> = {
  [P in keyof T as P extends keyof R ? R[P] : P]: T[P];
};

export type FilePayload = {
  hasErrors: boolean;
  results: CodeIssue[] | undefined;
};

export type CommonProps = {
  "data-testid"?: string;
};
