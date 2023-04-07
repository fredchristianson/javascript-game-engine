class Enum {
    static of(name) {
        return new Enum(name);
    }
    constructor(name) {
        this._name = name;
        this._symbol = Symbol(name);
    }

    equals(other) {
        return other != null && this._symbol == other._symbol;
    }

    toString() {
        return `Enum(${this._name})`;
    }
}

export { Enum };