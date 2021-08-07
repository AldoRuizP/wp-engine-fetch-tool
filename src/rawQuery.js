      
function getQuery(limit, offset){

    return `
    SELECT postID, name, title, publishDate, excerpt, content, categories, tags, imgUrl, imgID, imgAlt, imgCredits, authorName, authorUrl, authorBio
    FROM 
        (
            SELECT 
                wp_2_posts.ID as postID,
                wp_2_posts.post_name AS name,
                wp_2_posts.post_title AS title,
                wp_2_posts.post_date AS publishDate,
                wp_2_posts.post_excerpt AS excerpt,
                wp_2_posts.post_content AS content
            FROM wp_2_posts
            WHERE post_status = "publish" AND post_type = "post" 
            ORDER BY wp_2_posts.ID DESC
            LIMIT ${limit}
            OFFSET ${offset}
        ) t1 
        JOIN (
            SELECT GROUP_CONCAT(wp_2_terms.name SEPARATOR ', ') as categories, wp_2_term_relationships.object_id
            FROM wp_2_terms
                JOIN wp_2_term_taxonomy
                     ON wp_2_terms.term_id = wp_2_term_taxonomy.term_id
                JOIN wp_2_term_relationships
                    ON wp_2_term_relationships.term_taxonomy_id = wp_2_term_taxonomy.term_taxonomy_id
            WHERE taxonomy = "category"
            GROUP BY wp_2_term_relationships.object_id
        ) t2 ON t1.postID = t2.object_id
        JOIN (
            SELECT GROUP_CONCAT(wp_2_terms.name SEPARATOR ', ') as tags, wp_2_term_relationships.object_id
            FROM wp_2_terms
                JOIN wp_2_term_taxonomy
                    ON wp_2_terms.term_id = wp_2_term_taxonomy.term_id
                JOIN wp_2_term_relationships
                    ON wp_2_term_relationships.term_taxonomy_id = wp_2_term_taxonomy.term_taxonomy_id
            WHERE taxonomy = "post_tag"
            GROUP BY wp_2_term_relationships.object_id
        ) t3 ON t1.postID = t3.object_id
        JOIN (      
            SELECT guid as imgUrl, id as imgID, wp_2_postmeta.post_id
            FROM wp_2_posts
                JOIN wp_2_postmeta 
                    ON wp_2_posts.id = wp_2_postmeta.meta_value
            WHERE wp_2_postmeta.meta_key = "header_image"
        ) t4 ON t1.postID = t4.post_id
        JOIN (
            SELECT meta_value as imgAlt, wp_2_postmeta.post_id 
            FROM wp_2_postmeta
            WHERE meta_key = "_wp_attachment_image_alt" 
        ) t5 ON t4.imgID = t5.post_id
        JOIN (
            SELECT meta_value as imgCredits, wp_2_postmeta.post_id
            FROM wp_2_postmeta 
            WHERE meta_key = "credits" 
        ) t6 ON t4.imgID = t6.post_id
        JOIN (
            SELECT display_name AS authorName, user_url AS authorUrl, wp_2_posts.id 
            FROM wp_users
                JOIN wp_2_posts 
                    ON wp_users.id = wp_2_posts.post_author
        ) t7 ON t1.postID = t7.id
        JOIN (
            SELECT meta_value AS authorBio, wp_2_posts.id
            FROM wp_usermeta
                JOIN wp_2_posts 
                    ON wp_usermeta.user_id = wp_2_posts.post_author
            WHERE wp_usermeta.meta_key = "description"
        ) t8 ON t1.postID = t8.id
    `;
}

exports.getQuery = getQuery;
