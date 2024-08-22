(function (extension) {
    if (typeof showdown !== "undefined") {
        // global (browser or node.js global)
        extension(showdown);
    } else if (typeof define === "function" && define.amd) {
        // AMD
        define(["showdown"], extension);
    } else if (typeof exports === "object") {
        // Node, CommonJS-like
        module.exports = extension(require("showdown"));
    } else {
        // showdown was not found so an error is thrown
        throw Error("Could not find showdown library");
    }
}(function (showdown) {
    // loading extension into showdown
    /**
     * Showdown tasklist enhance extension: Assign unique id to checkboxes and wrap the content with `label for`; `options.tasklistCheckboxesPrefix` & `options.tasklistCheckboxesSuffix` are used to construct the id of checkboxes, default to `"tasklist-checkbox-"` & `""`.
     */
    function tasklistEnhance() {
        const ext = {
            type: "output",
            filter: function (text, converter, options) {
                const prefix = options.tasklistCheckboxesPrefix ?? "tasklist-checkbox-";
                const suffix = options.tasklistCheckboxesSuffix ?? "";
                let cnt = 0;
                // From: <li class="task-list-item" attrs><input type="checkbox" attrs>Any-content</li>
                // To: <li class="task-list-item" attrs><input type="checkbox" id="checkbox-0" attrs><label for="checkbox-0">Any-content</label></li>
                return text.replace(/<li class="task-list-item"([^>]*)><input type="checkbox"([^>]*)>(.+?)<\/li>/g, function (whole, liAttr, inputAttr, content) {
                    // Incremental id
                    const id = `${prefix}${cnt++}${suffix}`;
                    return `<li class="task-list-item"${liAttr}><input type="checkbox" id="${id}"${inputAttr}><label for="${id}">${content}</label></li>`;
                });
            }
        };
        return [ext];
    }
    showdown.extension("tasklistEnhance", tasklistEnhance);
}));