import * as ts from 'typescript';
export declare function findNode(node: ts.Node, kind: ts.SyntaxKind): ts.Node | null;
export declare function getNodes(node: ts.Node): ts.Node[];
