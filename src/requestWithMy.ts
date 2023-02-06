import { InvokeResult } from "./types/InvokeResult";
import { InvokeParams } from "./types/InvokeParams";

declare const my: any;

export const requestWithMy = <T>(args: InvokeParams) =>
  new Promise<InvokeResult<T>>((success, fail) => {
    const { headers, files, data, ...rest } = args;
    const fileNames = files ? Object.keys(files) : [];

    if (fileNames.length === 0) {
      /**
       * @see https://opendocs.alipay.com/mini/api/owycmh
       */
      my.request({ headers, data, ...rest, success, fail });
    } else if (fileNames.length === 1) {
      const name = fileNames[0];
      const filePath = files?.[name];
      /**
       * @see https://opendocs.alipay.com/mini/api/kmq4hc
       */
      my.uploadFile({
        header: headers,
        formData: data,
        name,
        filePath,
        ...rest,
        success: ({ header, ...rest }: any) =>
          success({ ...rest, headers: header }),
        fail,
      });
    } else {
      fail(
        new TypeError(
          "The Miniprogram does not support uploading multiple files in once"
        )
      );
    }
  });
