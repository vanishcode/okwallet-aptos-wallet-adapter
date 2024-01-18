import { OKXWallet } from "../index";

describe("OKXWallet", () => {
  const wallet = new OKXWallet();

  test("defines name", () => {
    expect(typeof wallet.name).toBe("string");
  });

  test("defines url", () => {
    expect(typeof wallet.url).toBe("string");
  });

  test("defines icon", () => {
    expect(typeof wallet.icon).toBe("string");
  });

  test("defines connect()", () => {
    expect(typeof wallet.connect).toBe("function");
  });

  test("defines account()", () => {
    expect(typeof wallet.account).toBe("function");
  });

  test("defines disconnect()", () => {
    expect(typeof wallet.disconnect).toBe("function");
  });

  test("defines signAndSubmitTransaction()", () => {
    expect(typeof wallet.signAndSubmitTransaction).toBe("function");
  });

  test("defines signMessage()", () => {
    expect(typeof wallet.signMessage).toBe("function");
  });

  test("defines onNetworkChange()", () => {
    expect(typeof wallet.onNetworkChange).toBe("function");
  });

  test("defines onAccountChange()", () => {
    expect(typeof wallet.onAccountChange).toBe("function");
  });

  test("defines network()", async () => {
    expect(await wallet.network()).toEqual({
      name: "mainnet",
      chainId: "1",
    });
    expect(typeof wallet.network).toBe("function");
  });

  test("defines deeplinkProvider", () => {
    console.log(wallet.deeplinkProvider({ url: "test" }));
    const result =
      "https://www.okx.com/download?deeplink=okx%3A%2F%2Fwallet%2Fdapp%2Furl%3FdappUrl%3Dtest";
    expect(typeof wallet.deeplinkProvider({ url: "test" })).toBe("string");
    expect(wallet.deeplinkProvider({ url: "test" })).toBe(result);
  });
});
