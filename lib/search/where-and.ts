import Where from "./where";

export default class WhereAnd extends Where {
  private left: Where;
  private right: Where;

  constructor(left: Where, right: Where) {
    super();
    this.left = left;
    this.right = right;
  }

  toString(): string {
    return `( ${this.left.toString()} ${this.right.toString()} )`;
  }
}
