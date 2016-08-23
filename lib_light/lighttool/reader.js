//0.02
var cengine;
(function (cengine) {
    var binReader = (function () {
        function binReader(buf, seek) {
            if (seek === void 0) { seek = 0; }
            this._seek = seek;
            this._buf = buf;
            this._data = new DataView(this._buf, seek);
        }
        binReader.prototype.seek = function (seek) {
            this._seek = seek;
        };
        binReader.prototype.peek = function () {
            return this._seek;
        };
        binReader.prototype.readStringAnsi = function () {
            var slen = this._data.getUint8(this._seek);
            this._seek++;
            var bs = "";
            for (var i = 0; i < slen; i++) {
                bs += String.fromCharCode(this._data.getUint8(this._seek));
                this._seek++;
            }
            return bs;
        };
        binReader.prototype.readStringUtf8 = function () {
            var length = this._data.getInt8(this._seek);
            this._seek++;
            var uri = "";
            for (var i = 0; i < length; i++) {
                var b = this._data.getUint8(this._seek);
                if (b > 0) {
                    uri += '%' + b.toString(16);
                }
                this._seek++;
            }
            return decodeURI(uri);
        };
        binReader.prototype.readStringUtf8FixLength = function (length) {
            var uri = "";
            for (var i = 0; i < length; i++) {
                var b = this._data.getUint8(this._seek);
                if (b > 0) {
                    uri += '%' + b.toString(16);
                }
                this._seek++;
            }
            return decodeURI(uri);
        };
        binReader.prototype.readSingle = function () {
            var num = this._data.getFloat32(this._seek, true);
            this._seek += 4;
            return num;
        };
        binReader.prototype.readDouble = function () {
            var num = this._data.getFloat64(this._seek, true);
            this._seek += 8;
            return num;
        };
        binReader.prototype.readInt8 = function () {
            var num = this._data.getInt8(this._seek);
            this._seek += 1;
            return num;
        };
        binReader.prototype.readUInt8 = function () {
            var num = this._data.getUint8(this._seek);
            this._seek += 1;
            return num;
        };
        binReader.prototype.readInt16 = function () {
            var num = this._data.getInt16(this._seek, true);
            this._seek += 2;
            return num;
        };
        binReader.prototype.readUInt16 = function () {
            var num = this._data.getUint16(this._seek, true);
            this._seek += 2;
            return num;
        };
        binReader.prototype.readInt32 = function () {
            var num = this._data.getInt32(this._seek, true);
            this._seek += 4;
            return num;
        };
        binReader.prototype.readUInt32 = function () {
            var num = this._data.getUint32(this._seek, true);
            this._seek += 4;
            return num;
        };
        binReader.prototype.readUint8Array = function (target, offset, length) {
            if (target === void 0) { target = null; }
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = -1; }
            if (length < 0)
                length = target.length;
            for (var i = 0; i < length; i++) {
                target[i] = this._data.getUint8(this._seek);
                this._seek++;
            }
            return target;
        };
        return binReader;
    }());
    cengine.binReader = binReader;
    var binWriter = (function () {
        //如果写入长度大于buf时，buf会被重新分配，最好不要带参构造
        function binWriter(buf, seek) {
            if (buf === void 0) { buf = null; }
            if (seek === void 0) { seek = 0; }
            if (buf == null) {
                buf = new ArrayBuffer(1024);
                this._length = 0;
            }
            else {
                this._length = buf.byteLength;
            }
            this._buf = buf;
            this._data = new DataView(this._buf);
            this._seek = seek;
        }
        binWriter.prototype.sureData = function (addlen) {
            var nextlen = this._buf.byteLength;
            while (this._buf.byteLength < (this._length + addlen)) {
                nextlen += 1024;
            }
            if (nextlen != this._buf.byteLength) {
                var newbuf = new ArrayBuffer(nextlen);
                for (var i = 0; i < this._buf.byteLength; i++) {
                    newbuf[i] = this._buf[i];
                }
                this._buf = newbuf;
            }
            this._length += addlen;
        };
        binWriter.prototype.getLength = function () {
            return length;
        };
        binWriter.prototype.getBuffer = function () {
            return this._buf.slice(0, this._length);
        };
        binWriter.prototype.seek = function (seek) {
            this._seek = seek;
        };
        binWriter.prototype.peek = function () {
            return this._seek;
        };
        binWriter.prototype.writeInt8 = function (num) {
            this.sureData(1);
            this._data.setInt8(this._seek, num);
            this._seek++;
        };
        binWriter.prototype.writeUInt8 = function (num) {
            this.sureData(1);
            this._data.setUint8(this._seek, num);
            this._seek++;
        };
        binWriter.prototype.writeInt16 = function (num) {
            this.sureData(2);
            this._data.setInt16(this._seek, num, true);
            this._seek += 2;
        };
        binWriter.prototype.writeUInt16 = function (num) {
            this.sureData(2);
            this._data.setUint16(this._seek, num, true);
            this._seek += 2;
        };
        binWriter.prototype.writeInt32 = function (num) {
            this.sureData(4);
            this._data.setInt32(this._seek, num, true);
            this._seek += 4;
        };
        binWriter.prototype.writeUInt32 = function (num) {
            this.sureData(4);
            this._data.setUint32(this._seek, num, true);
            this._seek += 4;
        };
        binWriter.prototype.writeSingle = function (num) {
            this.sureData(4);
            this._data.setFloat32(this._seek, num, true);
            this._seek += 4;
        };
        binWriter.prototype.writeDouble = function (num) {
            this.sureData(8);
            this._data.setFloat64(this._seek, num, true);
            this._seek += 8;
        };
        binWriter.prototype.writeStringAnsi = function (str) {
            var slen = str.length;
            this.sureData(slen + 1);
            this._data.setUint8(this._seek, slen);
            this._seek++;
            for (var i = 0; i < slen; i++) {
                this._data.setUint8(this._seek, str.charCodeAt(i));
                this._seek++;
            }
        };
        binWriter.prototype.writeStringUtf8 = function (str) {
            var bstr = binWriter.stringToUtf8Array(str);
            this.sureData(bstr.length + 1);
            this._data.setUint8(this._seek, bstr.length);
            this._seek++;
            for (var i = 0; i < bstr.length; i++) {
                this._data.setUint8(this._seek, bstr[i]);
                this._seek++;
            }
        };
        binWriter.stringToUtf8Array = function (str) {
            var bstr = [];
            for (var i = 0; i < str.length; i++) {
                var c = str.charAt(i);
                var cc = c.charCodeAt(0);
                if (cc > 0x7f) {
                    var es = encodeURI(c).split("%");
                    for (var j = 0; j < es.length; j++) {
                        if (es[j].length > 0)
                            bstr.push(parseInt(es[j], 16));
                    }
                }
                else {
                    bstr.push(cc);
                }
            }
            return bstr;
        };
        binWriter.prototype.writeStringUtf8DataOnly = function (str) {
            var bstr = binWriter.stringToUtf8Array(str);
            this.sureData(bstr.length);
            for (var i = 0; i < bstr.length; i++) {
                this._data.setUint8(this._seek, bstr[i]);
                this._seek++;
            }
        };
        binWriter.prototype.writeUint8Array = function (array, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            if (length < 0)
                length = array.length;
            this.sureData(length);
            for (var i = offset; i < offset + length; i++) {
                this._data.setUint8(this._seek, array[i]);
                this._seek++;
            }
        };
        return binWriter;
    }());
    cengine.binWriter = binWriter;
})(cengine || (cengine = {}));
//# sourceMappingURL=Reader.js.map