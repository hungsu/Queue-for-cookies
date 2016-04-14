Hi Hadjar!

This is a very simple implementation of the Who's here for cookies widget, using only the libraries already available to me in the base app.

I was tempted to use additional libraries to show my experience with them, but I think for such a tiny project that would be needlessly complex.

The Ruby implementation is very straightforward - it's almost entirely just what is available in the Pusher documentation. I was tempted to have the user signon automatically redirect them to the home page so they could line up for cookies right away, but this wasn't asked of me so I left it be.

The Javascript implementation should also be straightforward. It is almost entirely in one javascript file associated with the home page. In a more complex application, I would prefer for the widget's javascript to be kept inside an enclosed module depending on developer's module preference and existing frameworks, but this widget is so simple I felt that was all unnecessary.

Hung-Su
