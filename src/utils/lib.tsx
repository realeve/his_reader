import dayjs from 'dayjs';
/**
 *
 * @param {file文件对象，input type="file"} file
 * @param {回调函数} callback
 * @desc 将file图像文件对象转换为BASE64
 */
export let loadDataFile: (file: File, isBuffer: boolean) => Promise<null | Blob> = async (
  file: File,
  isBuffer = false,
) => {
  if (typeof FileReader === 'undefined') {
    return Promise.resolve(null);
  }

  let reader: FileReader = new FileReader();
  if (isBuffer) {
    reader.readAsArrayBuffer(file);
  } else {
    reader.readAsText(file);
  }

  return new Promise(resolve => {
    reader.onload = ({ target: { result } }: { target: { result: Blob } }) => {
      resolve(result);
    };
  });
};

export const encodeBase64 = (str: string) => window.btoa(unescape(encodeURIComponent(str)));

export const decodeBase64 = (str: string) => decodeURIComponent(escape(window.atob(str)));

export const now = () => dayjs().format('YYYY-MM-DD HH:mm:ss');
export const ymd = () => dayjs().format('YYYYMMDD');
export const ym = () => dayjs().format('YYYY年MM月');
export const ymdhms = () => dayjs().format('YYYY年MM月DD日 HH时mm分ss秒');
