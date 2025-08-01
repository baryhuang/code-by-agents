// File System Access API type definitions
declare global {
  interface Window {
    showDirectoryPicker?: () => Promise<FileSystemDirectoryHandle>;
    electronAPI?: {
      platform: string;
      openExternal: (url: string) => void;
      storage: {
        // Agent Configuration
        saveAgentConfig: (config: any) => Promise<{success: boolean, error?: string}>;
        loadAgentConfig: () => Promise<{success: boolean, data?: any, error?: string}>;
        
        // Chat Messages
        saveConversation: (sessionId: string, messages: any[]) => Promise<{success: boolean, error?: string}>;
        loadConversation: (sessionId: string) => Promise<{success: boolean, data?: any, error?: string}>;
        listConversations: () => Promise<{success: boolean, data?: any[], error?: string}>;
        
        // App Settings
        saveSetting: (key: string, value: any) => Promise<{success: boolean, error?: string}>;
        loadSetting: (key: string) => Promise<{success: boolean, data?: any, error?: string}>;
        loadAllSettings: () => Promise<{success: boolean, data?: any, error?: string}>;
      };
    };
  }

  interface FileSystemDirectoryHandle {
    readonly kind: "directory";
    readonly name: string;
  }
}

export {};
