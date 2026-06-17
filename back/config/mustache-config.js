import mustacheExpress from "mustache-express";
import path from "node:path";

export default function mustacheConfig(app, root) {
    const VIEWS_PATH = path.join(root, "views");
    app.engine('mst', mustacheExpress(
        VIEWS_PATH,
        '.mst'
    ))
    app.set('view engine', 'mst');
    app.set('views', VIEWS_PATH);
}
