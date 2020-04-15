const config = {
  files: 'src/**/*.{md,markdown,mdx}',
  htmlContext: {
    head: {
      links: [
        {
          rel: 'stylesheet',
          href:
            'https://fonts.googleapis.com/css?family=Kadwa:400,700|Montserrat:400,400i,700',
        },
      ],
    },
  },
  themeConfig: {
    colors: {
      header: {
        bg: '#9d2449',
      },
      sidebar: {
        bg: '#f4f6fc',
      },
      primary: '#cf913e',
    },
    styles: {
      body: {
        fontFamily: "'Montserrat', Helvetica Neue, Arial, sans",
        fontSize: 16,
      },
      h1: {
        fontFamily: "'Kadwa'",
      },
      h2: {
        fontFamily: "'Kadwa'",
      },
      h3: {
        fontFamily: "'Kadwa'",
      },
      logo: {
        background: 'transparent',
        alignItems: 'center',
      },
    },
  },
};

export default config;
