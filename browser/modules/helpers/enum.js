class Enum {
    constructor(name) {
        this._name = name;
        this._symbol = Symbol(name);
    }

    equals(other) {
        return other != null && this._symbol == other._symbol;
    }
}

export { Enum };