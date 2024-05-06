import { type AnySearchToken, SearchToken } from './visitor.ts';

interface TreeTransformerOpts {
  /**
   * The function used to transform each node
   */
  transform: (token: AnySearchToken) => unknown;

  /**
   * The tree to transform
   */
  tree: AnySearchToken[];
}

/**
 * Utility function to visit every Token node within an AST tree and apply
 * a transform to those nodes.
 */
export function treeTransformer({ tree, transform }: TreeTransformerOpts) {
  const nodeVisitor = (token?: AnySearchToken | null) => {
    if (!token) {
      return token;
    }

    switch (token.type) {
      case SearchToken.SearchQuery:
        return transform({
          ...token,
          selectClause: nodeVisitor(token.selectClause),
          fromClause: nodeVisitor(token.fromClause),
          whereClause: nodeVisitor(token.whereClause),
        });

      case SearchToken.SelectClause:
        return transform({
          ...token,
          columns: treeTransformer({ tree: token.columns, transform }),
        });

      case SearchToken.FromClause:
        return transform({
          ...token,
        });

      case SearchToken.WhereClause:
        return transform({
          ...token,
          conditions: treeTransformer({ tree: token.conditions, transform }),
        });

      case SearchToken.Qualifier:
        return transform({
          ...token,
          lhs: nodeVisitor(token.lhs),
          rhs: nodeVisitor(token.rhs),
        });

      case SearchToken.Function:
        return transform({
          ...token,
          args: token.args.map(a => treeTransformer({ tree: a, transform })),
        });

      case SearchToken.QualifierIn:
        return transform({
          ...token,
          values: treeTransformer({ tree: token.values, transform }),
        });

      default:
        return transform(token);
    }
  };

  return tree.map(nodeVisitor).filter(Boolean);
}
