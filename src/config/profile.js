// Single place to edit everything personal about the site.
export const profile = {
  github: 'younici',
  birthDate: '2008-12-23', // only the age is rendered, never the date itself
  email: 'kostantinreksha@gmail.com',
  links: [
    { id: 'github', url: 'https://github.com/younici', handle: '@younici' },
    {
      id: 'linkedin',
      url: 'https://www.linkedin.com/in/%D0%BA%D0%BE%D1%81%D1%82%D1%8F%D0%BD%D1%82%D0%B8%D0%BD-%D1%80%D0%B5%D0%BA%D1%88%D0%B0-494321373',
      handle: 'in/kostiantyn-reksha',
    },
    {
      id: 'instagram',
      url: 'https://www.instagram.com/real_younici',
      handle: '@real_younici',
    },
    { id: 'discord', url: 'https://discord.gg/avUNSNDv85', handle: 'discord.gg' },
    { id: 'telegram', url: 'https://t.me/younici', handle: '@younici' },
  ],
  // repos listed first, in this order (by name); everything else follows by activity
  pinnedRepos: [],
  // repos that should never show up in the grid
  hiddenRepos: [],
}

export function getAge(isoBirthDate, now = new Date()) {
  const b = new Date(isoBirthDate)
  let age = now.getFullYear() - b.getFullYear()
  const beforeBirthday =
    now.getMonth() < b.getMonth() ||
    (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())
  if (beforeBirthday) age -= 1
  return age
}
