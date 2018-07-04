## Commenter web-extension

A, uhm, extendable web-extension that takes the URL you're visiting and searches submission on other websites. Like this:

![A demo](https://i.imgur.com/yWSfDFs.gif)

### Now, what would you use that for?

Maybe you're browsing the old internet one day and you see an article. And you get this really big urge to see what the fine people on
HackerNews said about it. Or maybe you want to post it yourself and you want to see if anybody
had the same idea (they probably did, but it's under three submissions, it doesn't matter!).

Or, maybe you've found this great article on HackerNews and you want to see what the other kind of fine people
from Reddit have to say about _that_.

**Currently supported sources:** HackerNews and Reddit.

_This works for Firefox. Also for Chrome. Are you using Edge? I don't judge, it works there too. The magic of web-extensions._
### What to extend it? Here's how
Steps:
1. Of course, you need to fork the repo.
2. Read a guide about web-extensions to see how they work (totally optional)
3. Go to the _tests/observers_ folder and copy one of the tests, rename it, run it and TDD the hell out of it
4. Go to _src/observers_ and add your observer. Look at the other ones for examples, they're pretty straight forward
5. Oh yeah, do a _npm --install_ on the folder. _webpack --watch --mode development_ for live updating the exported code.
Run tests with _npm run test_. _web-ext run_ to run the extension in Firefox.

Then, do a merge request and I'll merge it. I might even review it first.


