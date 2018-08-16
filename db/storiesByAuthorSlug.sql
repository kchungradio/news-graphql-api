SELECT s.* FROM news.stories s
JOIN news.users u ON u.id = s.author_id
WHERE u.slug = ${slug}
ORDER BY s.published_at DESC
