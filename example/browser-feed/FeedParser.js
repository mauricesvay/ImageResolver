/**
 * Item
 */
function FeedItem() {
    this.title = '';
    this.link = '';
    this.description = '';
    this.date = '';
    this.id = '';
}
FeedItem.prototype = {
    toString: function() {
        return [
            this.title,
            this.link,
            this.description,
            this.date,
            this.id
        ].join("\n");
    }
};

/**
 * Parser
 */
function FeedParser() {
    this.items = [];
}

FeedParser.prototype = {
    parse: function(xml) {
        this.feedType = this.detectFormat(xml);
        switch (this.feedType) {
            case 'atom':
                this.parseAtom(xml);
                break;
            case 'rss':
                this.parseRss(xml);
                break;
            default:
                return false;
        }
    },

    detectFormat: function(xml) {
        //Atom?
        var atomRoot = xml.getElementsByTagName('feed');
        if (atomRoot.length > 0) {
            return 'atom';
        }

        //RSS?
        var rssRoot = xml.getElementsByTagName('rss');
        if (rssRoot.length > 0) {
            return 'rss';
        }
    },

    /**
     * Parse an ATOM feed
     */
    parseAtom: function(xml) {
        this.title = xml.getElementsByTagName('title')[0].textContent;

        var entries = xml.getElementsByTagName('entry');
        for (var i=0, l=entries.length; i<l; i++) {
            var item = new FeedItem();

            item.title = entries[i].getElementsByTagName('title')[0].textContent;
            item.link = entries[i].getElementsByTagName('link')[0].getAttribute('href');
            var content = entries[i].getElementsByTagName('content');
            if (content.length) {
                item.description = content[0].textContent;
            }
            item.date = entries[i].getElementsByTagName('updated')[0].textContent;
            item.id = entries[i].getElementsByTagName('id')[0].textContent;

            this.items.push(item);
        }
    },

    /**
     * Parse an RSS feed
     */
    parseRss: function(xml) {
        var channel = xml.getElementsByTagName('channel')[0];
        this.title = channel.getElementsByTagName('title')[0].textContent;

        var entries = xml.getElementsByTagName('item');
        for (var i=0, l=entries.length; i<l; i++) {
            var item = new FeedItem();

            item.title = entries[i].getElementsByTagName('title')[0].textContent;
            item.link = entries[i].getElementsByTagName('link')[0].textContent;
            var description = entries[i].getElementsByTagName('description');
            if (description.length) {
                item.description = description[0].textContent;
            }
            var pubDate = entries[i].getElementsByTagName('pubDate');
            if (pubDate.length) {
                item.date = entries[i].getElementsByTagName('pubDate')[0].textContent;
            }
            var guid = entries[i].getElementsByTagName('guid');
            if (guid.length) {
                item.id = entries[i].getElementsByTagName('guid')[0].textContent;
            }

            this.items.push(item);
        }
    }
};