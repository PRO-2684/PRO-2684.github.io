(function () {
    const query = $("#query");
    const primary = $("#primary");
    const primary_result = $("#primary-result");
    const secondary_ids = ["#count-len", "#count-val", "#start", "#end", "#start-bin", "#end-bin"];
    const secondary = secondary_ids.map(x => $(x));
    function binToList(s) {
        // Convert 1110000001000000 to [224, 64, 0, 0]
        // Pad to 32 bits
        for (var i = s.length; i < 32; i++) {
            s += '0';
        }
        var list = [];
        while (s.length) {
            list.push(parseInt(s.substr(0, 8), 2));
            s = s.substr(8);
        }
        return list;
    }
    function spacePad(s) {
        // Add space every 8 characters
        var r = '';
        while (s.length) {
            r += s.substr(0, 8) + ' ';
            s = s.substr(8);
        }
        return r.trim();
    }
    function prefixToHuman(s) {
        // Convert 11100000 01000000 to 224.64.0.0/16
        // Remove spaces
        s = s.replace(/ /g, '');
        var list = binToList(s);
        var ipv4 = list.join('.');
        return `${ipv4}/${s.length}`;
    }
    function humanToPrefix(s) {
        // Convert 224.64.0.0/16 to 11100000 01000000
        var [ipv4, len] = s.split('/');
        len = parseInt(len);
        var list = ipv4.split('.').map(x => parseInt(x));
        // Convert to binary
        var bin = list.map(x => x.toString(2).padStart(8, '0')).join(' ');
        // Truncate to length
        var length_with_spaces = len + Math.floor(len / 8);
        return bin.substr(0, length_with_spaces);
    }
    function prefixToRange(s) {
        // From binary prefix to available IP range
        s = s.replace(/ /g, '');
        var length = s.length;
        var left = 32 - length;
        var result = [];
        result.push(left.toString()); // #count-len
        result.push((Math.pow(2, left)).toString()); // #count-val
        var s_fill_0 = s.padEnd(32, '0');
        var s_fill_1 = s.padEnd(32, '1');
        var list = binToList(s_fill_0);
        var start = list.join('.');
        list = binToList(s_fill_1);
        var end = list.join('.');
        result.push(start); // #start
        result.push(end); // #end
        result.push(spacePad(s_fill_0)); // #start-bin
        result.push(spacePad(s_fill_1)); // #end-bin
        return result;
    }
    function process() {
        try {
            var s = query.value;
            var prefix = null;
            if (s.includes('/')) {
                prefix = humanToPrefix(s);
                primary.textContent = "Prefix";
                primary_result.textContent = prefix;
            } else {
                prefix = s;
                primary.textContent = "Human-friendly";
                primary_result.textContent = prefixToHuman(s);
            }
            var range = prefixToRange(prefix);
            for (var i = 0; i < range.length; i++) {
                secondary[i].textContent = range[i];
            }
        } catch (error) {
            console.log(error);
        }
    }
    query.addEventListener("input", process);
})();
