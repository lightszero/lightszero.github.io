/**
 * @fileoverview TSM - A TypeScript vector and matrix math library
 * @author Matthias Ferch
 * @version 0.6
 */

/*
 * Copyright (c) 2012 Matthias Ferch
 *
 * Project homepage: https://github.com/matthiasferch/tsm
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 */

//以TSM为基础，做了一些接口形式上的统一



namespace TSM
{
    var EPSILON = 0.000001;
    //lights fix
    export class vec2
    {
        constructor(x: number = 0, y: number = 0)
        {
            this.x = x;
            this.y = y;
        }
        x: number;
        y: number;

        static zero = new vec2(0, 0);
        toArray(dest: Float32Array, seek: number = 0): Float32Array
        {
            if (dest == null)
            {
                dest = new Float32Array(2);
                seek = 0;
            }
            dest[seek + 0] = this.x;
            dest[seek + 1] = this.y;
            return dest;
        }

        copy(dest: vec2 = null): vec2
        {
            if (!dest) dest = new vec2();

            dest.x = this.x;
            dest.y = this.y;

            return dest;
        }

        reset(): void
        {
            this.x = 0;
            this.y = 0;
        }


        negate(): void
        {
            this.x = -this.x;
            this.y = -this.y;
        }


        length(): number
        {
            return Math.sqrt(this.squaredLength());
        }

        squaredLength(): number
        {
            var x = this.x,
                y = this.y;

            return (x * x + y * y);
        }

        add(vector: vec2): void
        {
            this.x += vector.x;
            this.y += vector.y;

        }

        subtract(vector: vec2): void
        {
            this.x -= vector.x;
            this.y -= vector.y;
        }

        multiply(vector: vec2): void
        {
            this.x *= vector.x;
            this.y *= vector.y;
        }

        divide(vector: vec2): void
        {
            this.x /= vector.x;
            this.y /= vector.y;
        }

        scale(value: number): void
        {
            this.x *= value;
            this.y *= value;

        }

        normalize(dest: vec2 = null): void
        {

            var length = this.length();

            if (length === 1)
            {
                return;
            }

            if (length === 0)
            {
                dest.x = 0;
                dest.y = 0;

                return;
            }

            length = 1.0 / length;

            this.x *= length;
            this.y *= length;
        }

        multiplyMat2(matrix: mat2): void
        {
            matrix.multiplyVec2(this, this);
        }

        multiplyMat3(matrix: mat3): void
        {
            matrix.multiplyVec2(this, this);
        }
        static sEquals(vector: vec2, vector2: vec2, threshold = EPSILON): boolean
        {
            if (Math.abs(vector.x - vector2.x) > threshold)
                return false;

            if (Math.abs(vector.y - vector2.y) > threshold)
                return false;

            return true;
        }

        static sCross(vector: vec2, vector2: vec2, dest: vec3 = null): vec3
        {
            if (!dest) dest = new vec3();

            var x = vector.x,
                y = vector.y;

            var x2 = vector2.x,
                y2 = vector2.y;

            var z = x * y2 - y * x2;

            dest.x = 0;
            dest.y = 0;
            dest.z = z;

            return dest;
        }

        static sDot(vector: vec2, vector2: vec2): number
        {
            return (vector.x * vector2.x + vector.y * vector2.y);
        }

        static sDistance(vector: vec2, vector2: vec2): number
        {
            return Math.sqrt(this.sSquaredDistance(vector, vector2));
        }

        static sSquaredDistance(vector: vec2, vector2: vec2): number
        {
            var x = vector2.x - vector.x,
                y = vector2.y - vector.y;

            return (x * x + y * y);
        }

        static sDirection(vector: vec2, vector2: vec2, dest: vec2 = null): vec2
        {
            if (!dest) dest = new vec2();

            var x = vector.x - vector2.x,
                y = vector.y - vector2.y;

            var length = Math.sqrt(x * x + y * y);

            if (length === 0)
            {
                dest.x = 0;
                dest.y = 0;

                return dest;
            }

            length = 1 / length;

            dest.x = x * length;
            dest.y = y * length;

            return dest;
        }

        static sLerp(vector: vec2, vector2: vec2, v: number, dest: vec2 = null): vec2
        {
            dest.x = vector.x * (1 - v) + vector2.x * v;
            dest.y = vector.y * (1 - v) + vector2.y * v;
            return dest;
        }

        static sAdd(vector: vec2, vector2: vec2, dest: vec2 = null): vec2
        {
            if (!dest) dest = new vec2();

            dest.x = vector.x + vector2.x;
            dest.y = vector.y + vector2.y;

            return dest;
        }

        static sSubtract(vector: vec2, vector2: vec2, dest: vec2 = null): vec2
        {
            if (!dest) dest = new vec2();

            dest.x = vector.x - vector2.x;
            dest.y = vector.y - vector2.y;

            return dest;
        }

        static sProduct(vector: vec2, vector2: vec2, dest: vec2 = null): vec2
        {
            if (!dest) dest = new vec2();

            dest.x = vector.x * vector2.x;
            dest.y = vector.y * vector2.y;

            return dest;
        }

        static sDivide(vector: vec2, vector2: vec2, dest: vec2 = null): vec2
        {
            if (!dest) dest = new vec2();

            dest.x = vector.x / vector2.x;
            dest.y = vector.y / vector2.y;

            return dest;
        }
    }
    //lights fix
    export class vec3
    {
        constructor(x: number = 0, y: number = 0, z: number = 0)
        {
            this.x = x;
            this.y = y;
            this.z = z;
            var a = Number.MIN_VALUE;
        }

        x: number;
        y: number;
        z: number;


        static zero = new vec3(0, 0, 0);
        static up = new vec3(0, 1, 0);
        static right = new vec3(1, 0, 0);
        static forward = new vec3(0, 0, 1);
        //转换类
        toArray(dest: Float32Array, seek: number = 0): Float32Array
        {
            if (dest == null)
            {
                dest = new Float32Array(3);
                seek = 0;
            }
            dest[seek + 0] = this.x;
            dest[seek + 1] = this.y;
            dest[seek + 2] = this.z;

            return dest;
        }
        copy(dest: vec3 = null): vec3
        {
            if (!dest) dest = new vec3();

            dest.x = this.x;
            dest.y = this.y;
            dest.z = this.z;

            return dest;
        }
        toQuat(dest: quat = null): quat
        {
            if (!dest) dest = new quat();

            var c = new vec3();
            var s = new vec3();

            c.x = Math.cos(this.x * 0.5);
            s.x = Math.sin(this.x * 0.5);

            c.y = Math.cos(this.y * 0.5);
            s.y = Math.sin(this.y * 0.5);

            c.z = Math.cos(this.z * 0.5);
            s.z = Math.sin(this.z * 0.5);

            dest.x = s.x * c.y * c.z - c.x * s.y * s.z;
            dest.y = c.x * s.y * c.z + s.x * c.y * s.z;
            dest.z = c.x * c.y * s.z - s.x * s.y * c.z;
            dest.w = c.x * c.y * c.z + s.x * s.y * s.z;

            return dest;
        }

        //有返回值的不能有参数
        length(): number
        {
            return Math.sqrt(this.squaredLength());
        }

        squaredLength(): number
        {
            var x = this.x,
                y = this.y,
                z = this.z;

            return (x * x + y * y + z * z);
        }

        reset(): void
        {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }
        negate(): void
        {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
        }
        normalize(): void
        {
            var length = this.length();

            if (length === 1)
            {
                return;
            }

            if (length === 0)
            {
                this.x = 0;
                this.y = 0;
                this.z = 0;

                return;
            }

            length = 1.0 / length;

            this.x *= length;
            this.y *= length;
            this.z *= length;
        }


        //有参数的不能有返回值
        add(vector: vec3): void
        {
            this.x += vector.x;
            this.y += vector.y;
            this.z += vector.z;
        }

        subtract(vector: vec3): void
        {
            this.x -= vector.x;
            this.y -= vector.y;
            this.z -= vector.z;
        }

        multiply(vector: vec3): void
        {
            this.x *= vector.x;
            this.y *= vector.y;
            this.z *= vector.z;

        }

        divide(vector: vec3): void
        {
            this.x /= vector.x;
            this.y /= vector.y;
            this.z /= vector.z;

        }

        scale(value: number): void
        {

            this.x *= value;
            this.y *= value;
            this.z *= value;

        }



        multiplyByMat3(matrix: mat3): void
        {
            matrix.multiplyVec3(this, this);
        }

        multiplyByQuat(quat: quat): void
        {
            quat.multiplyVec3(this, this);
        }

        //又有参数又有返回值的必须是static
        static sEqual(vector: vec3, vector2: vec3, threshold = EPSILON): boolean
        {
            if (Math.abs(vector.x - vector2.x) > threshold)
                return false;

            if (Math.abs(vector.y - vector2.y) > threshold)
                return false;

            if (Math.abs(vector.z - vector2.z) > threshold)
                return false;

            return true;
        }

        static sCross(vector: vec3, vector2: vec3, dest: vec3 = null): vec3
        {
            if (!dest) dest = new vec3();

            var x = vector.x,
                y = vector.y,
                z = vector.z;

            var x2 = vector2.x,
                y2 = vector2.y,
                z2 = vector2.z;

            dest.x = y * z2 - z * y2;
            dest.y = z * x2 - x * z2;
            dest.z = x * y2 - y * x2;

            return dest;
        }

        static sDot(vector: vec3, vector2: vec3): number
        {
            var x = vector.x,
                y = vector.y,
                z = vector.z;

            var x2 = vector2.x,
                y2 = vector2.y,
                z2 = vector2.z;

            return (x * x2 + y * y2 + z * z2);
        }

        static sDistance(vector: vec3, vector2: vec3): number
        {
            var x = vector2.x - vector.x,
                y = vector2.y - vector.y,
                z = vector2.z - vector.z;

            return Math.sqrt(vec3.sSquaredDistance(vector, vector2));
        }

        static sSquaredDistance(vector: vec3, vector2: vec3): number
        {
            var x = vector2.x - vector.x,
                y = vector2.y - vector.y,
                z = vector2.z - vector.z;

            return (x * x + y * y + z * z);
        }

        static sDirection(vector: vec3, vector2: vec3, dest: vec3 = null): vec3
        {
            if (!dest) dest = new vec3();

            var x = vector.x - vector2.x,
                y = vector.y - vector2.y,
                z = vector.z - vector2.z;

            var length = Math.sqrt(x * x + y * y + z * z);

            if (length === 0)
            {
                dest.x = 0;
                dest.y = 0;
                dest.z = 0;

                return dest;
            }

            length = 1 / length;

            dest.x = x * length;
            dest.y = y * length;
            dest.z = z * length;

            return dest;
        }

        static sLerp(vector: vec3, vector2: vec3, v: number, dest: vec3 = null): vec3
        {
            if (!dest) dest = new vec3();

            dest.x = vector.x * (1 - v) + vector2.x * v;
            dest.y = vector.y * (1 - v) + vector2.y * v;
            dest.z = vector.z * (1 - v) + vector2.z * v;

            return dest;
        }

        static sAdd(vector: vec3, vector2: vec3, dest: vec3 = null): vec3
        {
            if (!dest) dest = new vec3();

            dest.x = vector.x + vector2.x;
            dest.y = vector.y + vector2.y;
            dest.z = vector.z + vector2.z;

            return dest;
        }

        static sSubtract(vector: vec3, vector2: vec3, dest: vec3 = null): vec3
        {
            if (!dest) dest = new vec3();

            dest.x = vector.x - vector2.x;
            dest.y = vector.y - vector2.y;
            dest.z = vector.z - vector2.z;

            return dest;
        }

        static sProduct(vector: vec3, vector2: vec3, dest: vec3 = null): vec3
        {
            if (!dest) dest = new vec3();

            dest.x = vector.x * vector2.x;
            dest.y = vector.y * vector2.y;
            dest.z = vector.z * vector2.z;

            return dest;
        }

        static sDivide(vector: vec3, vector2: vec3, dest: vec3 = null): vec3
        {
            if (!dest) dest = new vec3();

            dest.x = vector.x / vector2.x;
            dest.y = vector.y / vector2.y;
            dest.z = vector.z / vector2.z;

            return dest;
        }



    }
    //lights fix
    export class vec4
    {
        constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0)
        {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        x: number;
        y: number;
        z: number;
        w: number;

        static zero = new vec4(0, 0, 0, 1);

        toArray(dest: Float32Array = null, seek: number = 0): Float32Array
        {
            if (dest == null)
            {
                dest = new Float32Array(4);
                seek = 0;
            }
            dest[seek + 0] = this.x;
            dest[seek + 1] = this.y;
            dest[seek + 2] = this.z;
            dest[seek + 3] = this.z;
            return dest;
        }
        copy(dest: vec4 = null): vec4
        {
            if (!dest) dest = new vec4();

            dest.x = this.x;
            dest.y = this.y;
            dest.z = this.z;
            dest.w = this.w;

            return dest;
        }


        reset(): void
        {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 0;
        }



        negate(): void
        {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.w = -this.w;
        }


        length(): number
        {
            return Math.sqrt(this.squaredLength());
        }

        squaredLength(): number
        {
            var x = this.x,
                y = this.y,
                z = this.z,
                w = this.w;

            return (x * x + y * y + z * z + w * w);
        }

        add(vector: vec4): void
        {
            this.x += vector.x;
            this.y += vector.y;
            this.z += vector.z;
            this.w += vector.w;
        }

        subtract(vector: vec4): void
        {
            this.x -= vector.x;
            this.y -= vector.y;
            this.z -= vector.z;
            this.w -= vector.w;
        }

        multiply(vector: vec4): void
        {
            this.x *= vector.x;
            this.y *= vector.y;
            this.z *= vector.z;
            this.w *= vector.w;
        }

        divide(vector: vec4): void
        {
            this.x /= vector.x;
            this.y /= vector.y;
            this.z /= vector.z;
            this.w /= vector.w;
        }

        scale(value: number): void
        {
            this.x *= value;
            this.y *= value;
            this.z *= value;
            this.w *= value;
        }

        normalize(): void
        {
            var length = this.length();

            if (length === 1)
            {
                return;
            }

            if (length === 0)
            {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.w = 0;

                return;
            }

            length = 1.0 / length;

            this.x *= length;
            this.y *= length;
            this.z *= length;
            this.w *= length;
        }

        multiplyMat4(matrix: mat4): void
        {
            matrix.multiplyVec4(this, this);
        }
        static sEquals(vector: vec4, vector2: vec4, threshold = EPSILON): boolean
        {
            if (Math.abs(vector.x - vector2.x) > threshold)
                return false;

            if (Math.abs(vector.y - vector2.y) > threshold)
                return false;

            if (Math.abs(vector.z - vector2.z) > threshold)
                return false;

            if (Math.abs(vector.w - vector2.w) > threshold)
                return false;

            return true;
        }

        static sLerp(vector: vec4, vector2: vec4, v: number, dest: vec4 = null): vec4
        {
            if (!dest) dest = new vec4();

            dest.x = vector.x + v * (vector2.x - vector.x);
            dest.y = vector.y + v * (vector2.y - vector.y);
            dest.z = vector.z + v * (vector2.z - vector.z);
            dest.w = vector.w + v * (vector2.w - vector.w);

            return dest;
        }

        static sAdd(vector: vec4, vector2: vec4, dest: vec4 = null): vec4
        {
            if (!dest) dest = new vec4();

            dest.x = vector.x + vector2.x,
                dest.y = vector.y + vector2.y,
                dest.z = vector.z + vector2.z,
                dest.w = vector.w + vector2.w

            return dest;
        }

        static sSubtract(vector: vec4, vector2: vec4, dest: vec4 = null): vec4
        {
            if (!dest) dest = new vec4();

            dest.x = vector.x - vector2.x,
                dest.y = vector.y - vector2.y,
                dest.z = vector.z - vector2.z,
                dest.w = vector.w - vector2.w

            return dest;
        }

        static sProduct(vector: vec4, vector2: vec4, dest: vec4 = null): vec4
        {
            if (!dest) dest = new vec4();

            dest.x = vector.x * vector2.x,
                dest.y = vector.y * vector2.y,
                dest.z = vector.z * vector2.z,
                dest.w = vector.w * vector2.w

            return dest;
        }

        static sDivide(vector: vec4, vector2: vec4, dest: vec4 = null): vec4
        {
            if (!dest) dest = new vec4();

            dest.x = vector.x / vector2.x,
                dest.y = vector.y / vector2.y,
                dest.z = vector.z / vector2.z,
                dest.w = vector.w / vector2.w

            return dest;
        }


    }
    //lights fix
    export class mat2
    {

        static identity = new mat2([1, 0, 0, 1]).setIdentity();
        values = new Float32Array(4);

        constructor(values: number[] = null)
        {
            if (values)
            {
                this.init(values);
            }
        }

        at(index: number): number
        {
            return this.values[index];
        }

        init(values: number[]): void
        {
            for (var i = 0; i < 4; i++)
            {
                this.values[i] = values[i];
            }
        }

        reset(): void
        {
            for (var i = 0; i < 4; i++)
            {
                this.values[i] = 0;
            }
        }

        copy(dest: mat2 = null): mat2
        {
            if (!dest) dest = new mat2();

            for (var i = 0; i < 4; i++)
            {
                dest.values[i] = this.values[i];
            }

            return dest;
        }

        row(index: number): number[]
        {
            return [
                this.values[index * 2 + 0],
                this.values[index * 2 + 1]
            ];
        }

        col(index: number): number[]
        {
            return [
                this.values[index],
                this.values[index + 2]
            ];
        }



        determinant(): number
        {
            return this.values[0] * this.values[3] - this.values[2] * this.values[1];
        }

        setIdentity(): void
        {
            this.values[0] = 1;
            this.values[1] = 0;
            this.values[2] = 0;
            this.values[3] = 1;
        }

        transpose(): void
        {
            var temp = this.values[1];

            this.values[1] = this.values[2];
            this.values[2] = temp;
        }

        inverse(): void
        {
            var det = this.determinant();

            if (!det) return null;

            det = 1.0 / det;

            this.values[0] = det * (this.values[3]);
            this.values[1] = det * (-this.values[1]);
            this.values[2] = det * (-this.values[2]);
            this.values[3] = det * (this.values[0]);
        }

        multiply(matrix: mat2): void
        {
            var a11 = this.values[0],
                a12 = this.values[1],
                a21 = this.values[2],
                a22 = this.values[3];

            this.values[0] = a11 * matrix.at(0) + a12 * matrix.at(2);
            this.values[1] = a11 * matrix.at(1) + a12 * matrix.at(3);
            this.values[2] = a21 * matrix.at(0) + a22 * matrix.at(2);
            this.values[3] = a21 * matrix.at(1) + a22 * matrix.at(3);
        }

        rotate(angle: number): void
        {
            var a11 = this.values[0],
                a12 = this.values[1],
                a21 = this.values[2],
                a22 = this.values[3];

            var sin = Math.sin(angle),
                cos = Math.cos(angle);

            this.values[0] = a11 * cos + a12 * sin;
            this.values[1] = a11 * -sin + a12 * cos;
            this.values[2] = a21 * cos + a22 * sin;
            this.values[3] = a21 * -sin + a22 * cos;
        }

        multiplyVec2(vector: vec2, result: vec2 = null): vec2
        {
            var x = vector.x,
                y = vector.y;

            if (result)
            {
                result.x = x * this.values[0] + y * this.values[1];
                result.y = x * this.values[2] + y * this.values[3];
                return result;
            }
            else
            {
                return new vec2(
                    x * this.values[0] + y * this.values[1],
                    x * this.values[2] + y * this.values[3]
                );
            }
        }

        scale(vector: vec2): void
        {
            var a11 = this.values[0],
                a12 = this.values[1],
                a21 = this.values[2],
                a22 = this.values[3];

            var x = vector.x,
                y = vector.y;

            this.values[0] = a11 * x;
            this.values[1] = a12 * y;
            this.values[2] = a21 * x;
            this.values[3] = a22 * y;
        }
        static sEquals(matrix: mat2, matrix2: mat2, threshold = EPSILON): boolean
        {
            for (var i = 0; i < 4; i++)
            {
                if (Math.abs(matrix.values[i] - matrix2.at(i)) > threshold)
                    return false;
            }

            return true;
        }
        static sProduct(m1: mat2, m2: mat2, result: mat2 = null): mat2
        {
            var a11 = m1.at(0),
                a12 = m1.at(1),
                a21 = m1.at(2),
                a22 = m1.at(3);

            if (result)
            {
                result.init([
                    a11 * m2.at(0) + a12 * m2.at(2),
                    a11 * m2.at(1) + a12 * m2.at(3),
                    a21 * m2.at(0) + a22 * m2.at(2),
                    a21 * m2.at(1) + a22 * m2.at(3)
                ]);

                return result;
            }
            else
            {
                return new mat2([
                    a11 * m2.at(0) + a12 * m2.at(2),
                    a11 * m2.at(1) + a12 * m2.at(3),
                    a21 * m2.at(0) + a22 * m2.at(2),
                    a21 * m2.at(1) + a22 * m2.at(3)
                ]);
            }
        }


    }
    //lights fix
    export class mat3
    {
        static identity = new mat3([1, 0, 0, 0, 1, 0, 0, 0, 1]);

        values = new Float32Array(9);

        constructor(values: number[] = null)
        {
            if (values)
            {
                this.init(values);
            }
        }
        copy(dest: mat3 = null): mat3
        {
            if (!dest) dest = new mat3();

            for (var i = 0; i < 9; i++)
            {
                dest.values[i] = this.values[i];
            }

            return dest;
        }
        toQuat(dest: quat = null): quat
        {
            var m00 = this.values[0], m01 = this.values[1], m02 = this.values[2],
                m10 = this.values[3], m11 = this.values[4], m12 = this.values[5],
                m20 = this.values[6], m21 = this.values[7], m22 = this.values[8];

            var fourXSquaredMinus1 = m00 - m11 - m22;
            var fourYSquaredMinus1 = m11 - m00 - m22;
            var fourZSquaredMinus1 = m22 - m00 - m11;
            var fourWSquaredMinus1 = m00 + m11 + m22;

            var biggestIndex = 0;

            var fourBiggestSquaredMinus1 = fourWSquaredMinus1;

            if (fourXSquaredMinus1 > fourBiggestSquaredMinus1)
            {
                fourBiggestSquaredMinus1 = fourXSquaredMinus1;
                biggestIndex = 1;
            }

            if (fourYSquaredMinus1 > fourBiggestSquaredMinus1)
            {
                fourBiggestSquaredMinus1 = fourYSquaredMinus1;
                biggestIndex = 2;
            }

            if (fourZSquaredMinus1 > fourBiggestSquaredMinus1)
            {
                fourBiggestSquaredMinus1 = fourZSquaredMinus1;
                biggestIndex = 3;
            }

            var biggestVal = Math.sqrt(fourBiggestSquaredMinus1 + 1) * 0.5;
            var mult = 0.25 / biggestVal;

            if (dest == null)
                dest = new quat();

            switch (biggestIndex)
            {
                case 0:

                    dest.w = biggestVal;
                    dest.x = (m12 - m21) * mult;
                    dest.y = (m20 - m02) * mult;
                    dest.z = (m01 - m10) * mult;

                    break;

                case 1:

                    dest.w = (m12 - m21) * mult;
                    dest.x = biggestVal;
                    dest.y = (m01 + m10) * mult;
                    dest.z = (m20 + m02) * mult;

                    break;

                case 2:

                    dest.w = (m20 - m02) * mult;
                    dest.x = (m01 + m10) * mult;
                    dest.y = biggestVal;
                    dest.z = (m12 + m21) * mult;

                    break;

                case 3:

                    dest.w = (m01 - m10) * mult;
                    dest.x = (m20 + m02) * mult;
                    dest.y = (m12 + m21) * mult;
                    dest.z = biggestVal;

                    break;
            }

            return dest;
        }
        toMat4(result: mat4 = null): mat4
        {
            if (result)
            {
                result.init([
                    this.values[0],
                    this.values[1],
                    this.values[2],
                    0,

                    this.values[3],
                    this.values[4],
                    this.values[5],
                    0,

                    this.values[6],
                    this.values[7],
                    this.values[8],
                    0,

                    0,
                    0,
                    0,
                    1
                ]);

                return result;
            }
            else
            {
                return new mat4([
                    this.values[0],
                    this.values[1],
                    this.values[2],
                    0,

                    this.values[3],
                    this.values[4],
                    this.values[5],
                    0,

                    this.values[6],
                    this.values[7],
                    this.values[8],
                    0,

                    0,
                    0,
                    0,
                    1
                ]);
            }
        }

        at(index: number): number
        {
            return this.values[index];
        }

        init(values: number[]): void
        {
            for (var i = 0; i < 9; i++)
            {
                this.values[i] = values[i];
            }
        }

        reset(): void
        {
            for (var i = 0; i < 9; i++)
            {
                this.values[i] = 0;
            }
        }

        row(index: number): number[]
        {
            return [
                this.values[index * 3 + 0],
                this.values[index * 3 + 1],
                this.values[index * 3 + 2]
            ];
        }

        col(index: number): number[]
        {
            return [
                this.values[index],
                this.values[index + 3],
                this.values[index + 6]
            ];
        }


        determinant(): number
        {
            var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2],
                a10 = this.values[3], a11 = this.values[4], a12 = this.values[5],
                a20 = this.values[6], a21 = this.values[7], a22 = this.values[8];

            var det01 = a22 * a11 - a12 * a21,
                det11 = -a22 * a10 + a12 * a20,
                det21 = a21 * a10 - a11 * a20;

            return a00 * det01 + a01 * det11 + a02 * det21;
        }

        setIdentity(): void
        {
            this.values[0] = 1;
            this.values[1] = 0;
            this.values[2] = 0;
            this.values[3] = 0;
            this.values[4] = 1;
            this.values[5] = 0;
            this.values[6] = 0;
            this.values[7] = 0;
            this.values[8] = 1;

        }

        transpose(): void
        {
            var temp01 = this.values[1],
                temp02 = this.values[2],
                temp12 = this.values[5];

            this.values[1] = this.values[3];
            this.values[2] = this.values[6];
            this.values[3] = temp01;
            this.values[5] = this.values[7];
            this.values[6] = temp02;
            this.values[7] = temp12;

        }

        inverse(): void
        {
            var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2],
                a10 = this.values[3], a11 = this.values[4], a12 = this.values[5],
                a20 = this.values[6], a21 = this.values[7], a22 = this.values[8];

            var det01 = a22 * a11 - a12 * a21,
                det11 = -a22 * a10 + a12 * a20,
                det21 = a21 * a10 - a11 * a20;

            var det = a00 * det01 + a01 * det11 + a02 * det21;

            if (!det)
                return null;

            det = 1.0 / det;

            this.values[0] = det01 * det;
            this.values[1] = (-a22 * a01 + a02 * a21) * det;
            this.values[2] = (a12 * a01 - a02 * a11) * det;
            this.values[3] = det11 * det;
            this.values[4] = (a22 * a00 - a02 * a20) * det;
            this.values[5] = (-a12 * a00 + a02 * a10) * det;
            this.values[6] = det21 * det;
            this.values[7] = (-a21 * a00 + a01 * a20) * det;
            this.values[8] = (a11 * a00 - a01 * a10) * det;
        }

        multiply(matrix: mat3): void
        {
            var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2],
                a10 = this.values[3], a11 = this.values[4], a12 = this.values[5],
                a20 = this.values[6], a21 = this.values[7], a22 = this.values[8];

            var b00 = matrix.at(0), b01 = matrix.at(1), b02 = matrix.at(2),
                b10 = matrix.at(3), b11 = matrix.at(4), b12 = matrix.at(5),
                b20 = matrix.at(6), b21 = matrix.at(7), b22 = matrix.at(8);

            this.values[0] = b00 * a00 + b01 * a10 + b02 * a20;
            this.values[1] = b00 * a01 + b01 * a11 + b02 * a21;
            this.values[2] = b00 * a02 + b01 * a12 + b02 * a22;

            this.values[3] = b10 * a00 + b11 * a10 + b12 * a20;
            this.values[4] = b10 * a01 + b11 * a11 + b12 * a21;
            this.values[5] = b10 * a02 + b11 * a12 + b12 * a22;

            this.values[6] = b20 * a00 + b21 * a10 + b22 * a20;
            this.values[7] = b20 * a01 + b21 * a11 + b22 * a21;
            this.values[8] = b20 * a02 + b21 * a12 + b22 * a22;
        }

        multiplyVec2(vector: vec2, result: vec2 = null): vec2
        {
            var x = vector.x,
                y = vector.y;

            if (result)
            {
                result.x = x * this.values[0] + y * this.values[3] + this.values[6];
                result.y = x * this.values[1] + y * this.values[4] + this.values[7];
                return result;
            }
            else
            {
                return new vec2(
                    x * this.values[0] + y * this.values[3] + this.values[6],
                    x * this.values[1] + y * this.values[4] + this.values[7]
                );
            }
        }

        multiplyVec3(vector: vec3, result: vec3 = null): vec3
        {
            var x = vector.x,
                y = vector.y,
                z = vector.z;

            if (result)
            {
                result.x = x * this.values[0] + y * this.values[3] + z * this.values[6];
                result.y = x * this.values[1] + y * this.values[4] + z * this.values[7];
                result.z = x * this.values[2] + y * this.values[5] + z * this.values[8];
                return result;
            }
            else
            {
                return new vec3(
                    x * this.values[0] + y * this.values[3] + z * this.values[6],
                    x * this.values[1] + y * this.values[4] + z * this.values[7],
                    x * this.values[2] + y * this.values[5] + z * this.values[8]
                );
            }
        }



        rotate(angle: number, axis: vec3): void
        {
            var x = axis.x,
                y = axis.y,
                z = axis.z;

            var length = Math.sqrt(x * x + y * y + z * z);

            if (!length)
                return null;

            if (length !== 1)
            {
                length = 1 / length;
                x *= length;
                y *= length;
                z *= length;
            }

            var s = Math.sin(angle);
            var c = Math.cos(angle);

            var t = 1.0 - c;

            var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2],
                a10 = this.values[4], a11 = this.values[5], a12 = this.values[6],
                a20 = this.values[8], a21 = this.values[9], a22 = this.values[10];

            var b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s,
                b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s,
                b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c;

            this.values[0] = a00 * b00 + a10 * b01 + a20 * b02;
            this.values[1] = a01 * b00 + a11 * b01 + a21 * b02;
            this.values[2] = a02 * b00 + a12 * b01 + a22 * b02;

            this.values[3] = a00 * b10 + a10 * b11 + a20 * b12;
            this.values[4] = a01 * b10 + a11 * b11 + a21 * b12;
            this.values[5] = a02 * b10 + a12 * b11 + a22 * b12;

            this.values[6] = a00 * b20 + a10 * b21 + a20 * b22;
            this.values[7] = a01 * b20 + a11 * b21 + a21 * b22;
            this.values[8] = a02 * b20 + a12 * b21 + a22 * b22;
        }
        static sEquals(matrix: mat3, matrix2: mat3, threshold = EPSILON): boolean
        {
            for (var i = 0; i < 9; i++)
            {
                if (Math.abs(matrix.values[i] - matrix2.at(i)) > threshold)
                    return false;
            }

            return true;
        }

        static sProduct(m1: mat3, m2: mat3, result: mat3 = null): mat3
        {
            var a00 = m1.at(0), a01 = m1.at(1), a02 = m1.at(2),
                a10 = m1.at(3), a11 = m1.at(4), a12 = m1.at(5),
                a20 = m1.at(6), a21 = m1.at(7), a22 = m1.at(8);

            var b00 = m2.at(0), b01 = m2.at(1), b02 = m2.at(2),
                b10 = m2.at(3), b11 = m2.at(4), b12 = m2.at(5),
                b20 = m2.at(6), b21 = m2.at(7), b22 = m2.at(8);

            if (result)
            {
                result.init([
                    b00 * a00 + b01 * a10 + b02 * a20,
                    b00 * a01 + b01 * a11 + b02 * a21,
                    b00 * a02 + b01 * a12 + b02 * a22,

                    b10 * a00 + b11 * a10 + b12 * a20,
                    b10 * a01 + b11 * a11 + b12 * a21,
                    b10 * a02 + b11 * a12 + b12 * a22,

                    b20 * a00 + b21 * a10 + b22 * a20,
                    b20 * a01 + b21 * a11 + b22 * a21,
                    b20 * a02 + b21 * a12 + b22 * a22
                ]);

                return result;
            }
            else
            {
                return new mat3([
                    b00 * a00 + b01 * a10 + b02 * a20,
                    b00 * a01 + b01 * a11 + b02 * a21,
                    b00 * a02 + b01 * a12 + b02 * a22,

                    b10 * a00 + b11 * a10 + b12 * a20,
                    b10 * a01 + b11 * a11 + b12 * a21,
                    b10 * a02 + b11 * a12 + b12 * a22,

                    b20 * a00 + b21 * a10 + b22 * a20,
                    b20 * a01 + b21 * a11 + b22 * a21,
                    b20 * a02 + b21 * a12 + b22 * a22
                ]);
            }
        }


    }
    //lights fix
    export class mat4
    {
        static identity = new mat4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1]);

        values = new Float32Array(16);

        constructor(values: number[] = null)
        {
            if (values)
            {
                this.init(values);
            }
            else
            {
                mat4.identity.copy(this);
            }
        }

        at(index: number): number
        {
            return this.values[index];
        }

        init(values: number[]): void
        {
            for (var i = 0; i < 16; i++)
            {
                this.values[i] = values[i];
            }
        }

        reset(): void
        {
            for (var i = 0; i < 16; i++)
            {
                this.values[i] = 0;
            }
        }

        copy(dest: mat4 = null): mat4
        {
            if (!dest) dest = new mat4();

            for (var i = 0; i < 16; i++)
            {
                dest.values[i] = this.values[i];
            }

            return dest;
        }
        toMat3(dest: mat3 = null): mat3
        {
            if (!dest) 
            {

                return new mat3([
                    this.values[0],
                    this.values[1],
                    this.values[2],
                    this.values[4],
                    this.values[5],
                    this.values[6],
                    this.values[8],
                    this.values[9],
                    this.values[10]
                ]);
            }
            else
            {
                dest.values[0] = this.values[0];
                dest.values[1] = this.values[1];
                dest.values[2] = this.values[2];
                dest.values[3] = this.values[4];
                dest.values[4] = this.values[5];
                dest.values[5] = this.values[6];
                dest.values[6] = this.values[8];
                dest.values[7] = this.values[9];
                dest.values[8] = this.values[10];
                return dest;
            }
        }
        toInverseMat3(dest: mat3 = null): mat3
        {
            var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2],
                a10 = this.values[4], a11 = this.values[5], a12 = this.values[6],
                a20 = this.values[8], a21 = this.values[9], a22 = this.values[10];

            var det01 = a22 * a11 - a12 * a21,
                det11 = -a22 * a10 + a12 * a20,
                det21 = a21 * a10 - a11 * a20;

            var det = a00 * det01 + a01 * det11 + a02 * det21;

            if (!det)
                return null;

            det = 1.0 / det;
            if (!dest) 
            {
                return new mat3([
                    det01 * det,
                    (-a22 * a01 + a02 * a21) * det,
                    (a12 * a01 - a02 * a11) * det,
                    det11 * det,
                    (a22 * a00 - a02 * a20) * det,
                    (-a12 * a00 + a02 * a10) * det,
                    det21 * det,
                    (-a21 * a00 + a01 * a20) * det,
                    (a11 * a00 - a01 * a10) * det
                ]);
            }
            else
            {
                dest.values[0] = det01 * det;
                dest.values[1] = (-a22 * a01 + a02 * a21) * det;
                dest.values[2] = (a12 * a01 - a02 * a11) * det;
                dest.values[3] = det11 * det;
                dest.values[4] = (a22 * a00 - a02 * a20) * det;
                dest.values[5] = (-a12 * a00 + a02 * a10) * det;
                dest.values[6] = det21 * det;
                dest.values[7] = (-a21 * a00 + a01 * a20) * det;
                dest.values[8] = (a11 * a00 - a01 * a10) * det;
                return dest;
            }
        }

        row(index: number): number[]
        {
            return [
                this.values[index * 4 + 0],
                this.values[index * 4 + 1],
                this.values[index * 4 + 2],
                this.values[index * 4 + 3]
            ];
        }

        col(index: number): number[]
        {
            return [
                this.values[index],
                this.values[index + 4],
                this.values[index + 8],
                this.values[index + 12]
            ];
        }


        determinant(): number
        {
            var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2], a03 = this.values[3],
                a10 = this.values[4], a11 = this.values[5], a12 = this.values[6], a13 = this.values[7],
                a20 = this.values[8], a21 = this.values[9], a22 = this.values[10], a23 = this.values[11],
                a30 = this.values[12], a31 = this.values[13], a32 = this.values[14], a33 = this.values[15];

            var det00 = a00 * a11 - a01 * a10,
                det01 = a00 * a12 - a02 * a10,
                det02 = a00 * a13 - a03 * a10,
                det03 = a01 * a12 - a02 * a11,
                det04 = a01 * a13 - a03 * a11,
                det05 = a02 * a13 - a03 * a12,
                det06 = a20 * a31 - a21 * a30,
                det07 = a20 * a32 - a22 * a30,
                det08 = a20 * a33 - a23 * a30,
                det09 = a21 * a32 - a22 * a31,
                det10 = a21 * a33 - a23 * a31,
                det11 = a22 * a33 - a23 * a32;

            return (det00 * det11 - det01 * det10 + det02 * det09 + det03 * det08 - det04 * det07 + det05 * det06);
        }

        setIdentity(): void
        {
            this.values[0] = 1;
            this.values[1] = 0;
            this.values[2] = 0;
            this.values[3] = 0;
            this.values[4] = 0;
            this.values[5] = 1;
            this.values[6] = 0;
            this.values[7] = 0;
            this.values[8] = 0;
            this.values[9] = 0;
            this.values[10] = 1;
            this.values[11] = 0;
            this.values[12] = 0;
            this.values[13] = 0;
            this.values[14] = 0;
            this.values[15] = 1;
        }

        transpose(): void
        {
            var temp01 = this.values[1], temp02 = this.values[2],
                temp03 = this.values[3], temp12 = this.values[6],
                temp13 = this.values[7], temp23 = this.values[11];

            this.values[1] = this.values[4];
            this.values[2] = this.values[8];
            this.values[3] = this.values[12];
            this.values[4] = temp01;
            this.values[6] = this.values[9];
            this.values[7] = this.values[13];
            this.values[8] = temp02;
            this.values[9] = temp12;
            this.values[11] = this.values[14];
            this.values[12] = temp03;
            this.values[13] = temp13;
            this.values[14] = temp23;
        }

        inverse(): void
        {
            var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2], a03 = this.values[3],
                a10 = this.values[4], a11 = this.values[5], a12 = this.values[6], a13 = this.values[7],
                a20 = this.values[8], a21 = this.values[9], a22 = this.values[10], a23 = this.values[11],
                a30 = this.values[12], a31 = this.values[13], a32 = this.values[14], a33 = this.values[15];

            var det00 = a00 * a11 - a01 * a10,
                det01 = a00 * a12 - a02 * a10,
                det02 = a00 * a13 - a03 * a10,
                det03 = a01 * a12 - a02 * a11,
                det04 = a01 * a13 - a03 * a11,
                det05 = a02 * a13 - a03 * a12,
                det06 = a20 * a31 - a21 * a30,
                det07 = a20 * a32 - a22 * a30,
                det08 = a20 * a33 - a23 * a30,
                det09 = a21 * a32 - a22 * a31,
                det10 = a21 * a33 - a23 * a31,
                det11 = a22 * a33 - a23 * a32;

            var det = (det00 * det11 - det01 * det10 + det02 * det09 + det03 * det08 - det04 * det07 + det05 * det06);

            if (!det)
                return null;

            det = 1.0 / det;

            this.values[0] = (a11 * det11 - a12 * det10 + a13 * det09) * det;
            this.values[1] = (-a01 * det11 + a02 * det10 - a03 * det09) * det;
            this.values[2] = (a31 * det05 - a32 * det04 + a33 * det03) * det;
            this.values[3] = (-a21 * det05 + a22 * det04 - a23 * det03) * det;
            this.values[4] = (-a10 * det11 + a12 * det08 - a13 * det07) * det;
            this.values[5] = (a00 * det11 - a02 * det08 + a03 * det07) * det;
            this.values[6] = (-a30 * det05 + a32 * det02 - a33 * det01) * det;
            this.values[7] = (a20 * det05 - a22 * det02 + a23 * det01) * det;
            this.values[8] = (a10 * det10 - a11 * det08 + a13 * det06) * det;
            this.values[9] = (-a00 * det10 + a01 * det08 - a03 * det06) * det;
            this.values[10] = (a30 * det04 - a31 * det02 + a33 * det00) * det;
            this.values[11] = (-a20 * det04 + a21 * det02 - a23 * det00) * det;
            this.values[12] = (-a10 * det09 + a11 * det07 - a12 * det06) * det;
            this.values[13] = (a00 * det09 - a01 * det07 + a02 * det06) * det;
            this.values[14] = (-a30 * det03 + a31 * det01 - a32 * det00) * det;
            this.values[15] = (a20 * det03 - a21 * det01 + a22 * det00) * det;
        }

        multiply(matrix: mat4): void
        {
            var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2], a03 = this.values[3];
            var a10 = this.values[4], a11 = this.values[5], a12 = this.values[6], a13 = this.values[7];
            var a20 = this.values[8], a21 = this.values[9], a22 = this.values[10], a23 = this.values[11];
            var a30 = this.values[12], a31 = this.values[13], a32 = this.values[14], a33 = this.values[15];

            var b0 = matrix.at(0),
                b1 = matrix.at(1),
                b2 = matrix.at(2),
                b3 = matrix.at(3);

            this.values[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            this.values[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            this.values[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            this.values[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = matrix.at(4);
            b1 = matrix.at(5);
            b2 = matrix.at(6);
            b3 = matrix.at(7);

            this.values[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            this.values[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            this.values[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            this.values[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = matrix.at(8);
            b1 = matrix.at(9);
            b2 = matrix.at(10);
            b3 = matrix.at(11);

            this.values[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            this.values[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            this.values[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            this.values[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = matrix.at(12);
            b1 = matrix.at(13);
            b2 = matrix.at(14);
            b3 = matrix.at(15);

            this.values[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            this.values[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            this.values[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            this.values[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        }

        multiplyVec3(vector: vec3, dest: vec3 = null): vec3
        {
            var x = vector.x,
                y = vector.y,
                z = vector.z;
            if (!dest) 
            {
                return new vec3(
                    this.values[0] * x + this.values[4] * y + this.values[8] * z + this.values[12],
                    this.values[1] * x + this.values[5] * y + this.values[9] * z + this.values[13],
                    this.values[2] * x + this.values[6] * y + this.values[10] * z + this.values[14]
                );
            }
            else
            {
                dest.x = this.values[0] * x + this.values[4] * y + this.values[8] * z + this.values[12];
                dest.y = this.values[1] * x + this.values[5] * y + this.values[9] * z + this.values[13];
                dest.z = this.values[2] * x + this.values[6] * y + this.values[10] * z + this.values[14];
                return dest;
            }
        }

        multiplyVec4(vector: vec4, dest: vec4 = null): vec4
        {
            if (!dest) dest = new vec4();

            var x = vector.x,
                y = vector.y,
                z = vector.z,
                w = vector.w;

            dest.x = this.values[0] * x + this.values[4] * y + this.values[8] * z + this.values[12] * w;
            dest.y = this.values[1] * x + this.values[5] * y + this.values[9] * z + this.values[13] * w;
            dest.z = this.values[2] * x + this.values[6] * y + this.values[10] * z + this.values[14] * w;
            dest.w = this.values[3] * x + this.values[7] * y + this.values[11] * z + this.values[15] * w;

            return dest;
        }



        translate(vector: vec3): void
        {
            var x = vector.x,
                y = vector.y,
                z = vector.z;

            this.values[12] += this.values[0] * x + this.values[4] * y + this.values[8] * z;
            this.values[13] += this.values[1] * x + this.values[5] * y + this.values[9] * z;
            this.values[14] += this.values[2] * x + this.values[6] * y + this.values[10] * z;
            this.values[15] += this.values[3] * x + this.values[7] * y + this.values[11] * z;
        }

        scale(vector: vec3): void
        {
            var x = vector.x,
                y = vector.y,
                z = vector.z;

            this.values[0] *= x;
            this.values[1] *= x;
            this.values[2] *= x;
            this.values[3] *= x;

            this.values[4] *= y;
            this.values[5] *= y;
            this.values[6] *= y;
            this.values[7] *= y;

            this.values[8] *= z;
            this.values[9] *= z;
            this.values[10] *= z;
            this.values[11] *= z;
        }

        rotate(angle: number, axis: vec3): void
        {
            var x = axis.x,
                y = axis.y,
                z = axis.z;

            var length = Math.sqrt(x * x + y * y + z * z);

            if (!length)
                return null;

            if (length !== 1)
            {
                length = 1 / length;
                x *= length;
                y *= length;
                z *= length;
            }

            var s = Math.sin(angle);
            var c = Math.cos(angle);

            var t = 1.0 - c;

            var a00 = this.values[0], a01 = this.values[1], a02 = this.values[2], a03 = this.values[3],
                a10 = this.values[4], a11 = this.values[5], a12 = this.values[6], a13 = this.values[7],
                a20 = this.values[8], a21 = this.values[9], a22 = this.values[10], a23 = this.values[11];

            var b00 = x * x * t + c, b01 = y * x * t + z * s, b02 = z * x * t - y * s,
                b10 = x * y * t - z * s, b11 = y * y * t + c, b12 = z * y * t + x * s,
                b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c;

            this.values[0] = a00 * b00 + a10 * b01 + a20 * b02;
            this.values[1] = a01 * b00 + a11 * b01 + a21 * b02;
            this.values[2] = a02 * b00 + a12 * b01 + a22 * b02;
            this.values[3] = a03 * b00 + a13 * b01 + a23 * b02;

            this.values[4] = a00 * b10 + a10 * b11 + a20 * b12;
            this.values[5] = a01 * b10 + a11 * b11 + a21 * b12;
            this.values[6] = a02 * b10 + a12 * b11 + a22 * b12;
            this.values[7] = a03 * b10 + a13 * b11 + a23 * b12;

            this.values[8] = a00 * b20 + a10 * b21 + a20 * b22;
            this.values[9] = a01 * b20 + a11 * b21 + a21 * b22;
            this.values[10] = a02 * b20 + a12 * b21 + a22 * b22;
            this.values[11] = a03 * b20 + a13 * b21 + a23 * b22;
        }

        static sEquals(matrix: mat4, matrix2: mat4, threshold = EPSILON): boolean
        {
            for (var i = 0; i < 16; i++)
            {
                if (Math.abs(matrix.values[i] - matrix2.at(i)) > threshold)
                    return false;
            }
            return true;
        }

        //lights fix
        static sFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number, dest: mat4 = null): mat4
        {
            if (dest == null) dest = new mat4();

            var rl = (right - left),
                tb = (top - bottom),
                fn = (far - near);

            dest.values[0] = (near * 2) / rl;
            dest.values[1] = 0;
            dest.values[2] = 0;
            dest.values[3] = 0;

            dest.values[4] = 0;
            dest.values[5] = (near * 2) / tb;
            dest.values[6] = 0;
            dest.values[7] = 0;

            dest.values[8] = (right + left) / rl;
            dest.values[9] = (top + bottom) / tb;
            dest.values[10] = -(far + near) / fn;
            dest.values[11] = -1;

            dest.values[12] = 0;
            dest.values[13] = 0;
            dest.values[14] = -(far * near * 2) / fn;
            dest.values[15] = 0;
            return dest;
        }
        //lights fix
        static sPerspectiveLH(fov: number, aspect: number, znear: number, zfar: number, dest: mat4 = null): mat4
        {
            if (dest == null) dest = new mat4();

            var tan = 1.0 / (Math.tan(fov * 0.5));

            dest.values[0] = tan / aspect;
            dest.values[1] = dest.values[2] = dest.values[3] = 0.0;

            dest.values[4] = dest.values[6] = dest.values[7] = 0.0;
            dest.values[5] = tan;

            dest.values[8] = dest.values[9] = 0.0;
            dest.values[10] = -zfar / (znear - zfar);
            dest.values[11] = 1.0;

            dest.values[12] = dest.values[13] = dest.values[15] = 0.0;
            dest.values[14] = (znear * zfar) / (znear - zfar);



            return dest;
        }
        //lights fix
        static sOrthoLH(width: number, height: number, znear: number, zfar: number, dest: mat4 = null): mat4
        {
            var hw = 2.0 / width;
            var hh = 2.0 / height;
            var id = 1.0 / (zfar - znear);
            var nid = znear / (znear - zfar);

            if (dest == null) dest = new mat4();

            dest.values[0] = hw;
            dest.values[1] = 0;
            dest.values[2] = 0;
            dest.values[3] = 0;

            dest.values[4] = 0;
            dest.values[5] = hh;
            dest.values[6] = 0;
            dest.values[7] = 0;

            dest.values[8] = 0;
            dest.values[9] = 0;
            dest.values[10] = id;
            dest.values[11] = 0;

            dest.values[12] = 0;
            dest.values[13] = 0;
            dest.values[14] = nid;
            dest.values[15] = 1;


            return dest;
        }
        //lights fix
        static sLookatLH(eye: vec3, forward: vec3, up: vec3 = vec3.up, dest: mat4 = null): mat4
        {
            if (dest == null) dest = new mat4();


            // Z axis
            var z = forward;
            z.normalize();

            var y = up.copy();
            y.normalize();
            // X axis
            var x = vec3.sCross(y, z);
            if (x.squaredLength() == 0)
            {
                x.x = 1;
            }

            // Y axis
            y = vec3.sCross(z, x, y);

            // Eye angles
            var ex = -vec3.sDot(x, eye);
            var ey = -vec3.sDot(y, eye);
            var ez = -vec3.sDot(y, eye);

            dest.values[0] = x.x;
            dest.values[1] = y.x;
            dest.values[2] = z.x;
            dest.values[3] = 0;

            dest.values[4] = x.y;
            dest.values[5] = y.y;
            dest.values[6] = z.y;
            dest.values[7] = 0;

            dest.values[8] = x.z;
            dest.values[9] = y.z;
            dest.values[10] = z.z;
            dest.values[11] = 0;

            dest.values[12] = ex;
            dest.values[13] = ey;
            dest.values[14] = ez;
            dest.values[15] = 1;

            return dest;
        }

        static sProduct(m1: mat4, m2: mat4, result: mat4 = null): mat4
        {
            var a00 = m1.at(0), a01 = m1.at(1), a02 = m1.at(2), a03 = m1.at(3),
                a10 = m1.at(4), a11 = m1.at(5), a12 = m1.at(6), a13 = m1.at(7),
                a20 = m1.at(8), a21 = m1.at(9), a22 = m1.at(10), a23 = m1.at(11),
                a30 = m1.at(12), a31 = m1.at(13), a32 = m1.at(14), a33 = m1.at(15);

            var b00 = m2.at(0), b01 = m2.at(1), b02 = m2.at(2), b03 = m2.at(3),
                b10 = m2.at(4), b11 = m2.at(5), b12 = m2.at(6), b13 = m2.at(7),
                b20 = m2.at(8), b21 = m2.at(9), b22 = m2.at(10), b23 = m2.at(11),
                b30 = m2.at(12), b31 = m2.at(13), b32 = m2.at(14), b33 = m2.at(15);

            if (result)
            {
                result.init([
                    b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
                    b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
                    b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
                    b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,

                    b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
                    b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
                    b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
                    b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,

                    b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
                    b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
                    b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
                    b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,

                    b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
                    b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
                    b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
                    b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
                ]);

                return result;
            }
            else
            {
                return new mat4([
                    b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
                    b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
                    b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
                    b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,

                    b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
                    b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
                    b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
                    b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,

                    b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
                    b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
                    b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
                    b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,

                    b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
                    b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
                    b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
                    b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
                ]);
            }
        }

        //light add
        static sLerp(left: mat4, right: mat4, v: number, dest: mat4 = null): mat4
        {
            if (dest == null) dest = new mat4();
            for (var i = 0; i < 16; i++)
            {
                dest.values[i] = left.values[i] * (1 - v) + right.values[i] * v;
            }
            return dest;
        }
    }
    export class quat
    {
        constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0)
        {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        x: number;
        y: number;
        z: number;
        w: number;
        static identity = new quat(0, 0, 0, 1);
        copy(dest: quat = null): quat
        {
            if (!dest) dest = new quat();
            dest.x = this.x;
            dest.y = this.y;
            dest.z = this.z;
            dest.w = this.w;
            return dest;
        }
        toMat3(dest: mat3 = null): mat3
        {
            if (!dest) dest = new mat3();

            var x = this.x,
                y = this.y,
                z = this.z,
                w = this.w;

            var x2 = x + x,
                y2 = y + y,
                z2 = z + z;

            var xx = x * x2,
                xy = x * y2,
                xz = x * z2,
                yy = y * y2,
                yz = y * z2,
                zz = z * z2,
                wx = w * x2,
                wy = w * y2,
                wz = w * z2;

            dest.init([
                1 - (yy + zz),
                xy + wz,
                xz - wy,

                xy - wz,
                1 - (xx + zz),
                yz + wx,

                xz + wy,
                yz - wx,
                1 - (xx + yy)
            ]);

            return dest;
        }
        toMat4(dest: mat4 = null): mat4
        {
            if (!dest) dest = new mat4();

            var x = this.x,
                y = this.y,
                z = this.z,
                w = this.w,

                x2 = x + x,
                y2 = y + y,
                z2 = z + z,

                xx = x * x2,
                xy = x * y2,
                xz = x * z2,
                yy = y * y2,
                yz = y * z2,
                zz = z * z2,
                wx = w * x2,
                wy = w * y2,
                wz = w * z2;

            dest.init([
                1 - (yy + zz),
                xy + wz,
                xz - wy,
                0,

                xy - wz,
                1 - (xx + zz),
                yz + wx,
                0,

                xz + wy,
                yz - wx,
                1 - (xx + yy),
                0,

                0,
                0,
                0,
                1
            ]);

            return dest;
        }
        roll(): number
        {
            var x = this.x,
                y = this.y,
                z = this.z,
                w = this.w;

            return Math.atan2(2.0 * (x * y + w * z), w * w + x * x - y * y - z * z);
        }
        pitch(): number
        {
            var x = this.x,
                y = this.y,
                z = this.z,
                w = this.w;

            return Math.atan2(2.0 * (y * z + w * x), w * w - x * x - y * y + z * z);
        }
        yaw(): number
        {
            return Math.asin(2.0 * (this.x * this.z - this.w * this.y));
        }
        static sEquals(vector: quat, vector2: quat, threshold = EPSILON): boolean
        {
            if (Math.abs(vector.x - vector2.x) > threshold)
                return false;

            if (Math.abs(vector.y - vector2.y) > threshold)
                return false;

            if (Math.abs(vector.z - vector2.z) > threshold)
                return false;

            if (Math.abs(vector.w - vector2.w) > threshold)
                return false;

            return true;
        }
        setIdentity(): void
        {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;
        }
        calculateW(): void
        {
            var x = this.x,
                y = this.y,
                z = this.z;

            this.w = -(Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z)));
        }
        static sDot(q1: quat, q2: quat): number
        {
            return q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
        }
        inverse(): void
        {
            var dot = quat.sDot(this, this);

            if (!dot)
            {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.w = 0;

                return;
            }

            var invDot = dot ? 1.0 / dot : 0;

            this.x *= -invDot;
            this.y *= -invDot;
            this.z *= -invDot;
            this.w *= invDot;
        }
        conjugate(): void
        {
            this.x *= -1;
            this.y *= -1;
            this.z *= -1;
        }
        length(): number
        {
            var x = this.x,
                y = this.y,
                z = this.z,
                w = this.w;

            return Math.sqrt(x * x + y * y + z * z + w * w);
        }
        normalize(): void
        {

            var x = this.x,
                y = this.y,
                z = this.z,
                w = this.w;

            var length = Math.sqrt(x * x + y * y + z * z + w * w);

            if (!length)
            {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.w = 0;

                return;
            }

            length = 1 / length;

            this.x = x * length;
            this.y = y * length;
            this.z = z * length;
            this.w = w * length;
        }
        add(other: quat): void
        {
            this.x += other.x;
            this.y += other.y;
            this.z += other.z;
            this.w += other.w;
        }
        multiply(other: quat): void
        {
            var q2x = other.x,
                q2y = other.y,
                q2z = other.z,
                q2w = other.w;

            this.x = this.x * q2w + this.w * q2x + this.y * q2z - this.z * q2y;
            this.y = this.y * q2w + this.w * q2y + this.z * q2x - this.x * q2z;
            this.z = this.z * q2w + this.w * q2z + this.x * q2y - this.y * q2x;
            this.w = this.w * q2w - this.x * q2x - this.y * q2y - this.z * q2z;
        }
        multiplyVec3(vector: vec3, dest: vec3 = null): vec3
        {
            if (!dest) dest = new vec3();

            var x = vector.x,
                y = vector.y,
                z = vector.z;

            var qx = this.x,
                qy = this.y,
                qz = this.z,
                qw = this.w;

            var ix = qw * x + qy * z - qz * y,
                iy = qw * y + qz * x - qx * z,
                iz = qw * z + qx * y - qy * x,
                iw = -qx * x - qy * y - qz * z;

            dest.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            dest.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            dest.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

            return dest;
        }
        static sAdd(q1: quat, q2: quat, dest: quat = null): quat
        {
            if (!dest) dest = new quat();

            dest.x = q1.x + q2.x;
            dest.y = q1.y + q2.y;
            dest.z = q1.z + q2.z;
            dest.w = q1.w + q2.w;

            return dest;
        }
        static sProduct(q1: quat, q2: quat, dest: quat = null): quat
        {
            if (!dest) dest = new quat();

            var q1x = q1.x,
                q1y = q1.y,
                q1z = q1.z,
                q1w = q1.w,

                q2x = q2.x,
                q2y = q2.y,
                q2z = q2.z,
                q2w = q2.w;

            dest.x = q1x * q2w + q1w * q2x + q1y * q2z - q1z * q2y;
            dest.y = q1y * q2w + q1w * q2y + q1z * q2x - q1x * q2z;
            dest.z = q1z * q2w + q1w * q2z + q1x * q2y - q1y * q2x;
            dest.w = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;

            return dest;
        }

        static sCross(q1: quat, q2: quat, dest: quat = null): quat
        {
            if (!dest) dest = new quat();

            var q1x = q1.x,
                q1y = q1.y,
                q1z = q1.z,
                q1w = q1.w,

                q2x = q2.x,
                q2y = q2.y,
                q2z = q2.z,
                q2w = q2.w;

            dest.x = q1w * q2z + q1z * q2w + q1x * q2y - q1y * q2x;
            dest.y = q1w * q2w - q1x * q2x - q1y * q2y - q1z * q2z;
            dest.z = q1w * q2x + q1x * q2w + q1y * q2z - q1z * q2y;
            dest.w = q1w * q2y + q1y * q2w + q1z * q2x - q1x * q2z;

            return dest;
        }

        static sShortLerp(q1: quat, q2: quat, v: number, dest: quat = null): quat
        {
            if (!dest) dest = new quat();

            if (v <= 0.0)
            {
                return q1.copy(dest);
            } else if (v >= 1.0)
            {
                return q2.copy(dest);
            }

            var cos = quat.sDot(q1, q2),
                q2a = q2.copy();

            if (cos < 0.0)
            {
                q2a.inverse();
                cos = -cos;
            }

            var k0: number,
                k1: number;

            if (cos > 0.9999)
            {
                k0 = 1 - v;
                k1 = 0 + v;
            }
            else
            {
                var sin: number = Math.sqrt(1 - cos * cos);
                var angle: number = Math.atan2(sin, cos);

                var oneOverSin: number = 1 / sin;

                k0 = Math.sin((1 - v) * angle) * oneOverSin;
                k1 = Math.sin((0 + v) * angle) * oneOverSin;
            }

            dest.x = k0 * q1.x + k1 * q2a.x;
            dest.y = k0 * q1.y + k1 * q2a.y;
            dest.z = k0 * q1.z + k1 * q2a.z;
            dest.w = k0 * q1.w + k1 * q2a.w;

            return dest;
        }

        static sLerp(q1: quat, q2: quat, v: number, dest: quat = null): quat
        {
            if (!dest) dest = new quat();

            var cosHalfTheta = q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;

            if (Math.abs(cosHalfTheta) >= 1.0)
            {
                return q1.copy(dest);
            }

            var halfTheta = Math.acos(cosHalfTheta),
                sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);

            if (Math.abs(sinHalfTheta) < 0.001)
            {
                dest.x = q1.x * 0.5 + q2.x * 0.5;
                dest.y = q1.y * 0.5 + q2.y * 0.5;
                dest.z = q1.z * 0.5 + q2.z * 0.5;
                dest.w = q1.w * 0.5 + q2.w * 0.5;

                return dest;
            }

            var ratioA = Math.sin((1 - v) * halfTheta) / sinHalfTheta,
                ratioB = Math.sin(v * halfTheta) / sinHalfTheta;

            dest.x = q1.x * ratioA + q2.x * ratioB;
            dest.y = q1.y * ratioA + q2.y * ratioB;
            dest.z = q1.z * ratioA + q2.z * ratioB;
            dest.w = q1.w * ratioA + q2.w * ratioB;

            return dest;
        }

        static sFromAxis(axis: vec3, angle: number, dest: quat = null): quat
        {
            if (!dest) dest = new quat();

            angle *= 0.5;
            var sin = Math.sin(angle);

            dest.x = axis.x * sin;
            dest.y = axis.y * sin;
            dest.z = axis.z * sin;
            dest.w = Math.cos(angle);

            return dest;
        }


    }

}