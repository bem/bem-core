# Cache

You can cache parts of BEMHTML page by declaring cache keys in BEMJSON. As
data will be recursively converted to the html representation, BEMHTML engine
will find those keys and generate cache entries with generated html contents.

## Cache API

In order to use caching in BEMHTML you should provide a cache engine in options
to `BEMHTML` call. Every cache engine should have two methods with following
signatures:

* `Cache#set(key, [/* JSON data */])` - for putting key/value pair into some
  persistance storage;
* `Cache#get(key)` - for getting JSON data out of the storage.

Example:
```javascript
BEMHTML.call({/* BEMJSON data */}, {
  cache: {
    map: {},
    get: function(key) {
      if (!this.map.hasOwnProperty(key)) return;
      return this.map[key];
    },
    set: function(key, value) {
      this.map[key] = value;
    }
  }
});
```

Keys are always strings, but there're no contracts on value's schema. BEMHTML
engine internally decides what and why should be stored, the only purpose of
cache storage is to retrieve data that was put into it before, if it hasn't
expired (or considered irrelevant).

## Declaring cache keys in BEMJSON

Consider following BEMJSON sample:
```javascript
{
  "block": "b-nojs",
  "content":{
    "tag": "b",
    "content": {
      "tag": "i",
      "content": [
        {
          "elem": "eee",
          "content": {
            "tag": "b",
            "content": "blalba"
          }
        },
        {
          "block": "b2",
          "elem": "eee",
          "content": {
            "tag": "b",
            "content": "blalba"
          }
        },
        { "block": "b-bla" },
        { "block": "b-alb" }
      ]
    }
  }
}
```

Suppose we want to cache contents of block b-nojs (while having this block
dynamically generated each time). This can be achieved by declaring cache keys
in the corresponding BEMJSON entry.

```javascript
{
  "block": "b-nojs",
  "content":{
    "tag": "b",

    "cache": "any string you wish!!", // <---------

    "content": {
      "tag": "i",
      "content": [
        {
          "elem": "eee",
          "content": {
            "tag": "b",
            "content": "blalba"
          }
        },
        {
          "block": "b2",
          "elem": "eee",
          "content": {
            "tag": "b",
            "content": "blalba"
          }
        },
        { "block": "b-bla" },
        { "block": "b-alb" }
      ]
    }
  }
}
```

## Links

After this declaration BEMJSON entry's and all of it's subentries' (subtrees)
html contents will be stored in/fetched from cache on each render request.
Surely this can't be good for all cases, and instead of caching specific parts
of BEMJSON tree you can on the contrary cache only common parts, while leaving
some small pieces generating dynamically.

Just declare `link` property in BEMJSON entry that will redirect it's render to
other entry that resides in the `links` object.

Example:
```javascript
{
  "block": "b-nojs",
  "content":{
    "tag": "b",

    "cache": "any string you wish!!"

    "content": {
      "tag": "i",
      "content": [
        {
          "link": "dynamic-element", // <-----------
        },
        {
          "block": "b2",
          "elem": "eee",
          "content": {
            "tag": "b",
            "content": "blalba"
          }
        },
        { "block": "b-bla" },
        { "block": "b-alb" }
      ]
    },

    // Render will be redirected there once it'll find `link` property

    "links": {
      "dynamic-element": {
        "elem": "eee",
        "content": {
          "tag": "b",
          "content": "blalba"
        }
      }
    }
  }
}
```

Of course each link may have it's own cache key (or don't have one, as in
example above).
