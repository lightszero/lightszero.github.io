var lighttool;
(function (lighttool) {
    var Reader = (function () {
        function Reader(buf, seek) {
            if (seek === void 0) { seek = 0; }
            this.seek = seek;
            this.buf = buf;
            this.data = new DataView(this.buf, seek);
        }
        Reader.prototype.readString = function () {
            var slen = this.data.getUint8(this.seek);
            this.seek++;
            var bs = "";
            for (var i = 0; i < slen; i++) {
                bs += String.fromCharCode(this.data.getUint8(this.seek));
                this.seek++;
            }
            return bs;
        };
        Reader.prototype.readStringUtf8FixLength = function (length) {
            var uri = "";
            for (var i = 0; i < length; i++) {
                var b = this.data.getUint8(this.seek);
                if (b > 0) {
                    uri += '%' + b.toString(16);
                }
                this.seek++;
            }
            return decodeURI(uri);
        };
        Reader.prototype.readBound = function () {
            this.seek += 24;
            return null;
        };
        Reader.prototype.readUInt32 = function () {
            var num = this.data.getUint32(this.seek, true);
            this.seek += 4;
            return num;
        };
        Reader.prototype.readSingle = function () {
            var num = this.data.getFloat32(this.seek, true);
            this.seek += 4;
            return num;
        };
        Reader.prototype.readUInt8 = function () {
            var num = this.data.getUint8(this.seek);
            this.seek += 1;
            return num;
        };
        return Reader;
    }());
})(lighttool || (lighttool = {}));
//# sourceMappingURL=Reader.js.map