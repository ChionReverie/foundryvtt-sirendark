export default function() {
    const partials = [
        "modules/sirendark/templates/saves.hbs"
    ]
    const paths: Record<string, string> = {};
    for (const path of partials) {
        const [key] = path.split("/").slice(3).join("/").split(".");
        paths[key] = path;
    }
    foundry.applications.handlebars.loadTemplates(paths)
}
