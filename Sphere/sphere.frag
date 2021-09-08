//fragment shader
#version 330 core
struct PointLight
{
    vec3 pose;
    vec3 intensity;
    float a0;
    float a1;
    float a2;
};

struct DirectionalLight
{
    vec3 direction;
    vec3 intensity;
};

struct SpotLight
{
    vec3 pos;
    vec3 direction;
    vec3 intensity;
    float alpha;
    float cutoff;
    float a0;
    float a1;
    float a2;
};

struct Material
{
    float ka, kd, ks;
    float shiness;
};

in vec3 vertexColor;
in vec3 vertexNormal;
in vec3 vertexPos;
in vec2 vertexTex;
out vec4 FragColor;

uniform DirectionalLight dirLight;
uniform PointLight pointLight;
uniform SpotLight spotLight;
uniform Material material;
uniform vec3 viewpos;
uniform sampler2D textures;

vec3 CalculateDirectionalLight(DirectionalLight dirLight, vec3 normal, vec3 viewDir)
{
    vec3 lightDir = normalize(-dirLight.direction);
    vec3 ambient = material.ka * dirLight.intensity;
    vec3 diffuse = material.kd * max(dot(normal, lightDir), 0.0) * dirLight.intensity;
    vec3 H = normalize(viewDir + lightDir);
    vec3 specular = material.ks * pow(max(dot(H, normal), 0.0), material.shiness) * dirLight.intensity;
    return (ambient + diffuse + specular);
}

vec3 CalculatePointLight(PointLight pointLight, vec3 normal, vec3 vertexPos, vec3 viewDir)
{
    vec3 lightDir = normalize(pointLight.pose - vertexPos);
    vec3 ambient = material.ka * pointLight.intensity;
    vec3 diffuse = material.kd * max(dot(normal, lightDir),0.0) * pointLight.intensity;
    vec3 H = normalize(viewDir + lightDir);
    vec3 specular = material.ks * pow(max(dot(H, normal),0.0), material.shiness) * pointLight.intensity;
    float distance = length(pointLight.pose - vertexPos);
    float attenuation = 1.0 / (pointLight.a0 + pointLight.a1 * distance + pointLight.a2 * distance * distance);
    return (ambient + diffuse + specular) * attenuation;
}

vec3 CalculateSpotLight(SpotLight spotLight, vec3 normal, vec3 vertexPos, vec3 viewDir)
{
     vec3 lightDir1 = normalize(-spotLight.direction);
     vec3 lightDir2 = normalize(spotLight.pos - vertexPos);
     vec3 ambient = material.ka * spotLight.intensity; 
     vec3 diffuse = material.kd * max(dot(normal, lightDir2), 0.0) * spotLight.intensity;
     vec3 H = normalize(viewDir + lightDir2);
     vec3 specular = material.ks * pow(dot(H, normal), material.shiness) * spotLight.intensity;
     float distance = length(spotLight.pos - vertexPos);
     float attenuation = 1.0 / (spotLight.a0 + spotLight.a1 * distance + spotLight.a2 * distance * distance);
     float angle = dot(lightDir1, lightDir2);
     float angattenuation = angle > cos(spotLight.cutoff) ? pow(angle, spotLight.alpha) : 0.0;
     return ambient * attenuation + (diffuse + specular) * attenuation * angattenuation;
}

void main()
{
    vec3 viewDir = normalize(viewpos - vertexPos);
    vec3 normal = normalize(vertexNormal);
    vec3 result = //CalculateDirectionalLight(dirLight, normal, viewDir);
                    CalculatePointLight(pointLight, normal, vertexPos, viewDir);
                  //CalculateSpotLight(spotLight, normal, vertexPos, viewDir);
	FragColor = vec4(result, 1.0) * texture(textures, vertexTex);
}