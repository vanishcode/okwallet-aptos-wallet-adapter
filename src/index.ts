import {
  AptosWalletErrorResult,
  NetworkName,
  PluginProvider,
  WalletReadyState,
} from "@aptos-labs/wallet-adapter-core";
import type {
  AccountInfo,
  AdapterPlugin,
  NetworkInfo,
  SignMessagePayload,
  SignMessageResponse,
  WalletName,
} from "@aptos-labs/wallet-adapter-core";
import { Types } from "aptos";
interface OKXProvider extends Omit<PluginProvider, "signAndSubmitTransaction"> {
  signTransaction(
    transaction: any,
    options?: any
  ): Promise<Uint8Array | AptosWalletErrorResult>;
  signAndSubmitTransaction: (
    transaction: Types.TransactionPayload,
    options?: any
  ) => Promise<Types.HexEncodedBytes | AptosWalletErrorResult>;
}

interface OKXWalletInterface {
  aptos?: OKXProvider;
}

interface OKXWindow extends Window {
  okxwallet?: OKXWalletInterface;
}

declare const window: OKXWindow;

export const OKXWalletName = "OKX Wallet" as WalletName<"OKX Wallet">;

export class OKXWallet implements AdapterPlugin {
  private networkToChainId = {
    mainnet: 1,
  };
  readonly name = OKXWalletName;
  readonly url = "https://okx.com/web3/";
  readonly icon =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJDSURBVHgB7Zq9jtpAEMfHlhEgQLiioXEkoAGECwoKxMcTRHmC5E3IoyRPkPAEkI7unJYmTgEFTYwA8a3NTKScLnCHN6c9r1e3P2llWQy7M/s1Gv1twCP0ej37dDq9x+Zut1t3t9vZjDEHIiSRSPg4ZpDL5fxkMvn1cDh8m0wmfugfO53OoFQq/crn8wxfY9EymQyrVCqMfHvScZx1p9ls3pFxXBy/bKlUipGPrVbLuQqAfsCliq3zl0H84zwtjQrOw4Mt1W63P5LvBm2d+Xz+YzqdgkqUy+WgWCy+Mc/nc282m4FqLBYL+3g8fjDxenq72WxANZbLJeA13zDX67UDioL5ybXwafMYu64Ltn3bdDweQ5R97fd7GyhBQMipx4POeEDHIu2LfDdBIGGz+hJ9CQ1ABjoA2egAZPM6AgiCAEQhsi/C4jHyPA/6/f5NG3Ks2+3CYDC4aTccDrn6ojG54MnEvG00GoVmWLIRNZ7wTCwDHYBsdACy0QHIhiuRETxlICWpMMhGZHmqS8qH6JLyGegAZKMDkI0uKf8X4SWlaZo+Pp1bRrwlJU8ZKLIvUjKh0WiQ3sRUbNVq9c5Ebew7KEo2m/1p4jJ4qAmDaqDQBzj5XyiAT4VCQezJigAU+IDU+z8vJFnGWeC+bKQV/5VZ71FV6L7PA3gg3tXrdQ+DgLhC+75Wq3no69P3MC0NFQpx2lL04Ql9gHK1bRDjsSBIvScBnDTk1WrlGIZBorIDEYJj+rhdgnQ67VmWRe0zlplXl81vcyEt0rSoYDUAAAAASUVORK5CYII=";

  provider: OKXWalletInterface | undefined =
    typeof window !== "undefined" ? window?.okxwallet : undefined;

  readyState: WalletReadyState =
    typeof window !== "undefined"
      ? window?.okxwallet
        ? WalletReadyState.Installed
        : WalletReadyState.NotDetected
      : WalletReadyState.Unsupported;

  async connect(): Promise<AccountInfo> {
    try {
      const addressInfo = await this.provider?.aptos?.connect();
      if (!addressInfo) throw `${OKXWalletName} Address Info Error`;
      return addressInfo;
    } catch (error: any) {
      throw error;
    }
  }

  async account(): Promise<AccountInfo> {
    const response = await this.provider?.aptos?.account();
    if (!response) throw `${OKXWalletName} Account Error`;
    return response;
  }

  async disconnect(): Promise<void> {
    try {
      await this.provider?.aptos?.disconnect();
    } catch (error: any) {
      throw error;
    }
  }

  async signAndSubmitTransaction(
    transaction: Types.TransactionPayload,
    options?: any
  ): Promise<{ hash: Types.HexEncodedBytes }> {
    try {
      const response = await this.provider?.aptos?.signAndSubmitTransaction(
        transaction,
        options
      );

      if (!response) {
        throw new Error("No response") as AptosWalletErrorResult;
      }
      return { hash: response } as { hash: Types.HexEncodedBytes };
    } catch (error: any) {
      throw error;
    }
  }

  async signTransaction(
    transaction: Types.TransactionPayload,
    options?: any
  ): Promise<Uint8Array | AptosWalletErrorResult> {
    try {
      const response = await this.provider?.aptos?.signTransaction(
        transaction,
        options
      );
      if (!response) {
        throw new Error("No response") as AptosWalletErrorResult;
      }
      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    try {
      if (typeof message !== "object" || !message.nonce) {
        `${OKXWalletName} Invalid signMessage Payload`;
      }
      const response = await this.provider?.aptos?.signMessage(message);
      if (response) {
        return response;
      } else {
        throw `${OKXWalletName} Sign Message failed`;
      }
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async onNetworkChange(callback: any): Promise<void> {
    try {
      const handleNetworkChange = async (newNetwork: {
        networkName: NetworkInfo;
      }): Promise<void> => {
        callback({
          name: newNetwork,
          chainId: undefined,
          api: undefined,
        });
      };
      await this.provider?.aptos?.onNetworkChange(handleNetworkChange);
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async onAccountChange(callback: any): Promise<void> {
    try {
      const handleAccountChange = async (
        newAccount: AccountInfo
      ): Promise<void> => {
        if (newAccount?.publicKey) {
          callback({
            ...newAccount,
          });
        } else {
          const response = await this.connect();
          callback({
            ...response,
          });
        }
      };
      await this.provider?.aptos?.onAccountChange(handleAccountChange);
    } catch (error: any) {
      console.log(error);
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async network(): Promise<NetworkInfo> {
    try {
      const response = await this.provider?.aptos?.network();
      if (!response) throw `${OKXWalletName} Network Error`;
      return {
        name: response.toLowerCase() as NetworkName.Mainnet,
        chainId: this.networkToChainId[response.toLowerCase()],
      };
    } catch (error: any) {
      throw error;
    }
  }
}
