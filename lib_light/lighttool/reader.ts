//0.02
namespace cengine
{
    export class binReader
    {
        private _buf: ArrayBuffer;
        private _data: DataView;
        constructor(buf: ArrayBuffer, seek: number = 0)
        {
            this._seek = seek;
            this._buf = buf;
            this._data = new DataView(this._buf, seek);
        }
        private _seek: number;
        seek(seek: number)
        {
            this._seek = seek;
        }
        peek(): number
        {
            return this._seek;
        }
        readStringAnsi(): string
        {
            var slen = this._data.getUint8(this._seek);
            this._seek++;
            var bs: string = "";
            for (var i = 0; i < slen; i++)
            {
                bs += String.fromCharCode(this._data.getUint8(this._seek));
                this._seek++;
            }
            return bs;
        }
        readStringUtf8(): string
        {
            var length = this._data.getInt8(this._seek);
            this._seek++;

            var uri: string = "";
            for (var i = 0; i < length; i++)
            {
                var b = this._data.getUint8(this._seek);
                if (b > 0)
                {
                    uri += '%' + b.toString(16);
                }
                this._seek++;
            }


            return decodeURI(uri);
        }
        readStringUtf8FixLength(length: number): string
        {
            var uri: string = "";
            for (var i = 0; i < length; i++)
            {
                var b = this._data.getUint8(this._seek);
                if (b > 0)
                {
                    uri += '%' + b.toString(16);
                }
                this._seek++;
            }


            return decodeURI(uri);
        }
        readSingle(): number
        {
            var num = this._data.getFloat32(this._seek, true);
            this._seek += 4;
            return num;
        }
        readDouble(): number
        {
            var num = this._data.getFloat64(this._seek, true);
            this._seek += 8;
            return num;
        }
        readInt8(): number
        {
            var num = this._data.getInt8(this._seek);
            this._seek += 1;
            return num;
        }
        readUInt8(): number
        {
            var num = this._data.getUint8(this._seek);
            this._seek += 1;
            return num;
        }
        readInt16(): number
        {
            var num = this._data.getInt16(this._seek, true);
            this._seek += 2;
            return num;
        }
        readUInt16(): number
        {
            var num = this._data.getUint16(this._seek, true);
            this._seek += 2;
            return num;
        }
        readInt32(): number
        {
            var num = this._data.getInt32(this._seek, true);
            this._seek += 4;
            return num;
        }
        readUInt32(): number
        {
            var num = this._data.getUint32(this._seek, true);
            this._seek += 4;
            return num;
        }
        readUint8Array(target: Uint8Array = null, offset: number = 0, length: number = -1): Uint8Array
        {
            if (length < 0) length = target.length;
            for (var i = 0; i < length; i++)
            {
                target[i] = this._data.getUint8(this._seek);
                this._seek++;
            }
            return target;
        }
    }
    export class binWriter
    {
        _buf: ArrayBuffer;
        private _data: DataView;
        private _length: number;
        private _seek: number;

        //如果写入长度大于buf时，buf会被重新分配，最好不要带参构造
        constructor(buf: ArrayBuffer = null, seek: number = 0)
        {
            if (buf == null)
            {
                buf = new ArrayBuffer(1024);
                this._length = 0;
            }
            else
            {
                this._length = buf.byteLength;
            }
            this._buf = buf;
            this._data = new DataView(this._buf);
            this._seek = seek;
        }
        private sureData(addlen: number): void
        {
            var nextlen = this._buf.byteLength;
            while (this._buf.byteLength < (this._length + addlen))
            {
                nextlen += 1024;
            }
            if (nextlen != this._buf.byteLength)
            {
                var newbuf = new ArrayBuffer(nextlen);
                for (var i = 0; i < this._buf.byteLength; i++)
                {
                    newbuf[i] = this._buf[i];
                }
                this._buf = newbuf;
            }
            this._length += addlen;
        }
        getLength(): number
        {
            return length;
        }
        getBuffer(): ArrayBuffer
        {
            return this._buf.slice(0, this._length);
        }
        seek(seek: number)
        {
            this._seek = seek;
        }
        peek(): number
        {
            return this._seek;
        }
        writeInt8(num: number): void
        {
            this.sureData(1);
            this._data.setInt8(this._seek, num);
            this._seek++;

        }
        writeUInt8(num: number): void
        {
            this.sureData(1);
            this._data.setUint8(this._seek, num);
            this._seek++;
        }
        writeInt16(num: number): void
        {
            this.sureData(2);
            this._data.setInt16(this._seek, num, true);
            this._seek += 2;
        }
        writeUInt16(num: number): void
        {
            this.sureData(2);
            this._data.setUint16(this._seek, num, true);
            this._seek += 2;
        }
        writeInt32(num: number): void
        {
            this.sureData(4);
            this._data.setInt32(this._seek, num, true);
            this._seek += 4;
        }
        writeUInt32(num: number): void
        {
            this.sureData(4);
            this._data.setUint32(this._seek, num, true);
            this._seek += 4;
        }
        writeSingle(num: number): void
        {
            this.sureData(4);
            this._data.setFloat32(this._seek, num, true);
            this._seek += 4;
        }
        writeDouble(num: number): void
        {
            this.sureData(8);
            this._data.setFloat64(this._seek, num, true);
            this._seek += 8;
        }
        writeStringAnsi(str: string): void
        {
            var slen = str.length;
            this.sureData(slen + 1);
            this._data.setUint8(this._seek, slen);
            this._seek++;
            for (var i = 0; i < slen; i++)
            {
                this._data.setUint8(this._seek, str.charCodeAt(i));
                this._seek++;
            }
        }
        writeStringUtf8(str: string)
        {
            var bstr = binWriter.stringToUtf8Array(str);
            this.sureData(bstr.length + 1);
            this._data.setUint8(this._seek, bstr.length);
            this._seek++;
            for (var i = 0; i < bstr.length; i++)
            {
                this._data.setUint8(this._seek, bstr[i]);
                this._seek++;
            }
        }
        static stringToUtf8Array(str: string): number[]
        {
            var bstr: number[] = [];
            for (var i = 0; i < str.length; i++)
            {
                var c = str.charAt(i);
                var cc = c.charCodeAt(0);
                if (cc > 0x7f)
                {
                    var es = encodeURI(c).split("%");
                    for (var j = 0; j < es.length; j++)
                    {
                        if (es[j].length > 0)
                            bstr.push(parseInt(es[j], 16));
                    }
                }
                else
                {
                    bstr.push(cc);
                }
            }
            return bstr;
        }
        writeStringUtf8DataOnly(str: string)
        {
            var bstr = binWriter.stringToUtf8Array(str);
            this.sureData(bstr.length);
            for (var i = 0; i < bstr.length; i++)
            {
                this._data.setUint8(this._seek, bstr[i]);
                this._seek++;
            }
        }
        writeUint8Array(array: Uint8Array | number[], offset: number = 0, length: number = 0)
        {
            if (length < 0) length = array.length;
            this.sureData(length);
            for (var i = offset; i < offset + length; i++)
            {
                this._data.setUint8(this._seek, array[i]);
                this._seek++;
            }
        }
    }
}