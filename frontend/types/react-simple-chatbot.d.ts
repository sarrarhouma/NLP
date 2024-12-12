declare module "react-simple-chatbot" {
    import { FC } from "react";
  
    interface ChatBotProps {
      steps: Array<{
        id: string;
        message?: string;
        options?: Array<{
          value: string;
          label: string;
          trigger: string;
        }>;
        trigger?: string;
        end?: boolean;
      }>;
      floating?: boolean;
      headerTitle?: string;
      botAvatar?: string;
      userAvatar?: string;
      hideBotAvatar?: boolean;
      hideUserAvatar?: boolean;
      botDelay?: number;
      userDelay?: number;
      customStyle?: React.CSSProperties;
      customClass?: string;
      footerComponent?: FC;
    }
  
    const ChatBot: FC<ChatBotProps>;
  
    export default ChatBot;
  }
  